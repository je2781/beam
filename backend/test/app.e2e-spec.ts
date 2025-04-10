import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from 'pactum';
import { AppModule } from "./../src/app.module";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { UserService } from "../src/user/user.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(0); // random available port

    const server = app.getHttpServer();
    const address = server.address();
    const port = typeof address === "string" ? address : address?.port;
    pactum.request.setBaseUrl(`http://localhost:${port}`);

    userService = app.get(UserService);
  });

  afterEach(async () => {
    await userService.deleteUser("test300@test.com");
    await app.close();
  });

  describe("Auth", () => {
    const signupDto: AuthDto = {
      email: "test300@test.com",
      password: "server1",
      full_name: "John Doe",
    };

    describe("Signup", () => {
      it("should throw an error if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody({ password: signupDto.password })
          .expectStatus(400);
      });

      it("should throw an error if password is empty", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody({ email: signupDto.email })
          .expectStatus(400);
      });

      it("should signup", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody(signupDto)
          .expectStatus(201);
      });
    });

    describe("Signin", () => {
      it("should signin", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody(signupDto)
          .expectStatus(200)
          .stores("userAt", "access_token");
      });
    });
  });

  describe("User", () => {
    const editDto: EditUserDto = {
      full_name: "Joshua",
      email: "vlad@gmail.com",
    };

    describe("Get me", () => {
      it("should get user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({ Authorization: "Bearer $S{userAt}" })
          .expectStatus(200);
      });
    });
  });

  describe("Transactions", () => {
    it("should return empty list", () => {
      return pactum
        .spec()
        .get("/transactions")
        .withHeaders({ Authorization: "Bearer $S{userAt}" })
        .expectStatus(200)
        .expectBody([]);
    });
  });
});
