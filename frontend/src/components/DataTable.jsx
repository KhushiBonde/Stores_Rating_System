import { useState } from 'react';
import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';

const DataTable = ({ columns, data, onSortChange, sortBy, sortOrder, loading, emptyMessage }) => {
  const handleSort = (field) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <HiSelector className="sort-icon neutral" />;
    return sortOrder === 'asc' 
      ? <HiChevronUp className="sort-icon active" /> 
      : <HiChevronDown className="sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table" id="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && handleSort(col.key)}
                id={`th-${col.key}`}
              >
                <div className="th-content">
                  <span>{col.label}</span>
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                {emptyMessage || 'No data found.'}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className="table-row">
                {columns.map((col) => (
                  <td key={col.key} id={`td-${col.key}-${row.id || index}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
