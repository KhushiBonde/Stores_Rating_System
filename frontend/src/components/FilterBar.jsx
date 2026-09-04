import { useState } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

const FilterBar = ({ filters, onFilterChange, onClear }) => {
  const [values, setValues] = useState(() => {
    const initial = {};
    filters.forEach(f => { initial[f.key] = f.value || ''; });
    return initial;
  });

  const handleChange = (key, value) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(values);
  };

  const handleClear = () => {
    const cleared = {};
    filters.forEach(f => { cleared[f.key] = ''; });
    setValues(cleared);
    if (onClear) onClear();
    else onFilterChange(cleared);
  };

  const hasActiveFilters = Object.values(values).some(v => v !== '');

  return (
    <form className="filter-bar" onSubmit={handleSubmit} id="filter-bar">
      <div className="filter-inputs">
        {filters.map((filter) => (
          <div key={filter.key} className="filter-input-group">
            {filter.type === 'select' ? (
              <select
                id={`filter-${filter.key}`}
                value={values[filter.key]}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="filter-select"
              >
                <option value="">{filter.placeholder || `All ${filter.label}`}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={`filter-${filter.key}`}
                placeholder={filter.placeholder || `Search ${filter.label}...`}
                value={values[filter.key]}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="filter-input"
              />
            )}
          </div>
        ))}
      </div>
      <div className="filter-actions">
        <button type="submit" className="btn btn-primary btn-sm" id="filter-apply">
          <HiSearch /> Search
        </button>
        {hasActiveFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleClear} id="filter-clear">
            <HiX /> Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default FilterBar;
