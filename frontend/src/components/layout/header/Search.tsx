export default function SearchBar({display}: {display: string}) {
  return (
    <div className={`lg:w-[58%] font-inter font-normal text-sm w-[90%] lg:mt-3 pr-0 lg:flex ${display} flex-row items-center bg-search-bg rounded-2xl justify-between`}>
      <input
        className="pl-4 py-2 focus:outline-none placeholder:font-inter placeholder:text-sm h-full bg-transparent w-full text-search-text"
        id="search"
        placeholder="Search"
      />
      <span className="cursor-pointer pr-5 py-2 h-full">
        <i className="fa-solid cursor-pointer fa-search text-sm text-search-icon transition-all duration-300 ease-out transform hover:scale-110"></i>
      </span>
    </div>
  );
}
