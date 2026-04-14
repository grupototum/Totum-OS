# Phase 3.2: Component Decomposition Guide

## Overview
This document outlines the strategy for decomposing mega-components into smaller, reusable, maintainable components.

## Mega-Components to Decompose

### 1. **ContentPipeline.tsx** (~800 lines)
**Current Issues:**
- Handles content creation, editing, and display
- Mixed data fetching, state management, and UI logic
- Multiple nested conditionals

**Decomposition Plan:**
```
ContentPipeline/
├── ContentPipelineLayout.tsx (container)
├── components/
│   ├── ContentForm.tsx (form logic)
│   ├── ContentList.tsx (display list)
│   ├── ContentCard.tsx (individual item)
│   ├── ContentFilters.tsx (filtering UI)
│   └── ContentActions.tsx (bulk actions)
└── hooks/
    ├── useContentPipeline.ts (data fetching)
    └── useContentForm.ts (form state)
```

### 2. **HostingPanel.tsx** (~600 lines)
**Current Issues:**
- Infrastructure management UI
- Multiple tabs with different functionality
- Complex deployment logic

**Decomposition Plan:**
```
HostingPanel/
├── HostingPanelLayout.tsx (container)
├── components/
│   ├── ServerStatus.tsx
│   ├── DeploymentConfig.tsx
│   ├── HealthMetrics.tsx
│   ├── BackupManager.tsx
│   └── SettingsPanel.tsx
└── hooks/
    ├── useServerStatus.ts
    └── useDeploymentConfig.ts
```

### 3. **ClientsCenter.tsx** (~900 lines)
**Current Issues:**
- Client management with CRUD operations
- Drag-and-drop functionality mixed with data logic
- Multiple views (grid, list, detail)

**Decomposition Plan:**
```
ClientsCenter/
├── ClientsCenterLayout.tsx (container)
├── components/
│   ├── ClientCard.tsx (grid view)
│   ├── ClientList.tsx (list view)
│   ├── ClientDetail.tsx (detail view)
│   ├── ClientForm.tsx (create/edit)
│   ├── ClientSearch.tsx (filtering)
│   └── ClientActions.tsx (bulk ops)
├── hooks/
│   └── useClients.ts (data fetching)
└── utils/
    └── clientSort.ts (sorting logic)
```

### 4. **EditClient.tsx** (~500 lines)
**Current Issues:**
- Form validation mixed with submission
- Multiple sections not separated
- Nested state management

**Decomposition Plan:**
```
EditClient/
├── EditClientLayout.tsx (container)
├── sections/
│   ├── ClientBasicInfo.tsx
│   ├── ClientContacts.tsx
│   ├── ClientBilling.tsx
│   └── ClientMetadata.tsx
├── components/
│   └── ClientFormActions.tsx
└── hooks/
    └── useClientForm.ts
```

## Decomposition Principles

### 1. **Single Responsibility**
- Each component handles ONE concern (display, form, list, etc.)
- Data fetching in custom hooks, not components
- Styling in dedicated files or Tailwind classes

### 2. **Container vs Presentational**
```tsx
// Container Component (smart)
export function ClientsCenter() {
  const { clients, loading } = useClients();
  return <ClientsCenterUI clients={clients} loading={loading} />;
}

// Presentational Component (dumb)
export function ClientsCenterUI({ clients, loading }) {
  if (loading) return <ClientListSkeleton />;
  return <ClientList clients={clients} />;
}
```

### 3. **Custom Hooks for Logic**
```tsx
// Hook: encapsulates data fetching and state
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);
  
  return { clients, loading };
}
```

### 4. **Component Composition**
```tsx
// Bad: Everything in one component
<div>
  <input onChange={handleSearch} />
  {filtered.map(item => (
    <div key={item.id}>
      <h3>{item.name}</h3>
      <button onClick={() => handleEdit(item)}>Edit</button>
    </div>
  ))}
</div>

// Good: Composed components
<ClientSearch onChange={onSearch} />
<ClientList clients={filtered} onEdit={onEdit} />
```

## Implementation Strategy

### Step 1: Extract Hooks
- Move data fetching to custom hooks
- Extract state management logic
- Keep components for UI only

### Step 2: Create Presentational Components
- Break down large JSX into smaller components
- Use props for all data and callbacks
- Test with different states

### Step 3: Update Parent Component
- Use custom hooks for data
- Compose smaller components
- Delegate event handlers

### Step 4: Add Loading States
- Use `CardSkeleton`, `TableSkeleton`, etc.
- Show skeletons during data loading
- Maintain consistent UX

## Example: Complete Decomposition

**Before:**
```tsx
// ClientsCenter.tsx (~900 lines)
export function ClientsCenter() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    setLoading(true);
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);
  
  const filtered = clients.filter(c => c.name.includes(search));
  
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <div>Loading...</div> : null}
      {filtered.map(client => (
        <div key={client.id}>
          <h3>{client.name}</h3>
          <button onClick={() => navigate(`/edit-client/${client.id}`)}>Edit</button>
        </div>
      ))}
    </div>
  );
}
```

**After:**
```tsx
// ClientsCenter.tsx (~200 lines)
import { useClients } from './hooks/useClients';
import { ClientSearch } from './components/ClientSearch';
import { ClientList } from './components/ClientList';
import { ClientListSkeleton } from '@/components/loaders';

export function ClientsCenter() {
  const { clients, loading } = useClients();
  const [search, setSearch] = useState('');
  
  const filtered = clients.filter(c => c.name.includes(search));
  
  return (
    <div className="space-y-4">
      <ClientSearch value={search} onChange={setSearch} />
      {loading ? (
        <ClientListSkeleton />
      ) : (
        <ClientList clients={filtered} />
      )}
    </div>
  );
}

// hooks/useClients.ts
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);
  
  return { clients, loading };
}

// components/ClientSearch.tsx
export function ClientSearch({ value, onChange }) {
  return (
    <input 
      className="w-full px-3 py-2 border border-zinc-800 rounded"
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder="Search clients..."
    />
  );
}

// components/ClientList.tsx
export function ClientList({ clients }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

## Testing Decomposed Components

```tsx
// components/__tests__/ClientSearch.test.tsx
import { render, screen } from '@testing-library/react';
import { ClientSearch } from '../ClientSearch';

describe('ClientSearch', () => {
  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(<ClientSearch value="" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Search clients...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onChange).toHaveBeenCalledWith('test');
  });
});
```

## Progress Tracking

- [ ] ContentPipeline decomposition
- [ ] HostingPanel decomposition  
- [ ] ClientsCenter decomposition
- [ ] EditClient decomposition
- [ ] Component tests added
- [ ] Loading states integrated
- [ ] Accessibility audit completed

## Notes

- **Incremental**: Decompose one component at a time
- **Test**: Add tests as you decompose
- **Document**: Update Storybook/docs after changes
- **Review**: Components should be <300 lines each
