import './CollectionFilters.css';

const CollectionFilters = ({
  materials = [],
  selectedMaterial,
  onMaterialChange = () => {},
  priceOptions = [],
  sizeOptions = [],
  colorOptions = [],
  sortOptions = [],
  filters = {},
  onFilterChange = () => {},
  showSort = true,
  showSearch = false,
  searchValue = '',
  onSearchChange = () => {}
}) => {
  const renderSelect = (label, field, options) => {
    if (!options.length) return null;

    return (
      <label className="filter-control">
        <span>{label}</span>
        <select
          value={filters[field] ?? ''}
          onChange={(e) => onFilterChange(field, e.target.value)}
        >
          {options.map(({ label: optionLabel, value }) => (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <div className="advanced-filters">
      {materials.length > 0 && (
        <div className="material-chips">
          {materials.map((material) => (
            <button
              key={material}
              type="button"
              className={`filter-chip ${selectedMaterial === material ? 'active' : ''}`}
              onClick={() => onMaterialChange(material)}
            >
              {material}
            </button>
          ))}
        </div>
      )}

      <div className="filter-grid">
        {renderSelect('Price', 'priceRange', priceOptions)}
        {renderSelect('Size', 'size', sizeOptions)}
        {renderSelect('Color', 'color', colorOptions)}
        {showSort && renderSelect('Sort', 'sort', sortOptions)}
      </div>

      {showSearch && (
        <div className="filter-search">
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search silhouettes, fabrics, fits"
          />
        </div>
      )}
    </div>
  );
};

export default CollectionFilters;
