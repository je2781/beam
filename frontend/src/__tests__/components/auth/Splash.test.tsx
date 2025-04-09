import { render} from "@testing-library/react";
import { screen} from "@testing-library/dom";
import Splash from "../../../components/auth/Signup";


// Mock the Logo component
jest.mock('../../../components/logo/Logo', () => {
    return function MockLogo() {
      return <div data-testid="logo">Logo Component</div>;
    };
  });
  
// Define props interface for the mock
interface MockImageProps {
    alt: string;
    src: string | undefined;
    [key: string]: any; // To allow additional props
  }
  
  // Mocking the next/image component
  jest.mock('next/image', () => {
    return function MockImage({ alt, src, ...props }: MockImageProps) {
      return <img src={src} alt={alt} {...props} />;
    };
  });

  describe('SplashScreen Component', () => {
  
    it('renders the splash screen with a custom image', () => {
      const customImageSrc = '/path/to/custom/image.png'; // Example custom image path
      render(<Splash src={customImageSrc} />);
  
      // Check if the Logo is rendered
      expect(screen.getByTestId('logo')).toBeInTheDocument();
  
      // Check if the Image component renders with the custom image
      const image = screen.getByAltText('splash image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', customImageSrc); // Ensure it points to the custom image
    });
  });