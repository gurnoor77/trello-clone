import './SearchBar.css';

const SearchBar = ({ search, setSearch, filterLabel, setFilterLabel, filterMember, setFilterMember, members }) => {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="🔍 Search cards..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select
        className="filter-select"
        value={filterLabel}
        onChange={e => setFilterLabel(e.target.value)}>
        <option value="">All Labels</option>
        <option value="#eb5a46">Bug</option>
        <option value="#0079bf">Feature</option>
        <option value="#f2d600">Urgent</option>
        <option value="#61bd4f">Done</option>
        <option value="#ff9f1a">In Progress</option>
      </select>
      <select
        className="filter-select"
        value={filterMember}
        onChange={e => setFilterMember(e.target.value)}>
        <option value="">All Members</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      {(search || filterLabel || filterMember) && (
        <button className="clear-btn" onClick={() => {
          setSearch('');
          setFilterLabel('');
          setFilterMember('');
        }}>✕ Clear</button>
      )}
    </div>
  );
};

export default SearchBar;