import CategoryItem from "./CategoryItem";

const CategorySideBar = ({ categories, className, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 z-40 w-full lg:w-1/3 h-full bg-gray-800 text-white p-4 overflow-y-auto transition-transform duration-300 transform ${className}`}
    >
      {/* Close Button */}
      
      <button
        className="absolute top-4 right-4 text-white bg-emerald-600 hover:bg-emerald-500 p-2 rounded-full"
        onClick={onClose}
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-emerald-400 mb-4">Categories</h2>
      <div className="flex flex-col space-y-4">
        {categories.map((category) => (
          <CategoryItem category={category} key={category.name} />
        ))}
      </div>
    </div>
  );
};

export default CategorySideBar;