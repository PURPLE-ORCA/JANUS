### Install shadcn/table DataTable

Source: https://www.shadcntable.com/docs/components/data-table

Installs the shadcn/table DataTable component using pnpm. This is the initial step to integrate the component into your project.

```bash
pnpm dlx shadcn@latest add https://shadcntable.com/r/data-table.json
```

--------------------------------

### DataTable Manual Server-Side Pagination Example in TypeScript/React

Source: https://www.shadcntable.com/docs/examples/data-table-manual-pagination

This example demonstrates manual/server-side pagination for the DataTable component. It utilizes @tanstack/react-query for data fetching and manages pagination state externally. The DataTable is configured to run in manual mode, allowing for custom data fetching logic based on page index and page size. Dependencies include react, @tanstack/react-query, and shadcn/ui components.

```tsx
'use client'

import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type Person = {
  firstName: string
  lastName: string
  email: string
}

type UsersApiResponse = {
  rows: Person[]
  rowCount: number
}

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
]

export function ManualPaginationDemo() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ManualPaginationTable />
    </QueryClientProvider>
  )
}

function ManualPaginationTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useQuery<UsersApiResponse>({
    queryKey: ['users', pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      })

      const res = await fetch(`/api/users?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }

      return await res.json()
    },
    placeholderData: keepPreviousData,
  })

  const rows = data?.rows ?? []
  const rowCount = data?.rowCount ?? 0

  return (
    <DataTable
      columns={columns}
      data={rows}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={{
        manual: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        rowCount,
        onPaginationChange: setPagination,
        pageSizeOptions: [5, 10, 25, 50],
      }}
      toolbar={{
        search: true,
        viewOptions: true,
      }}
    />
  )
}

```

--------------------------------

### Render DataTable Component (React/TypeScript)

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Combines the defined columns and data to render the DataTable component. This example shows a complete component setup, including necessary imports and type definitions.

```tsx
'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/components/shadcntable/data-table-column-header'

type User = {
  id: string
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
  },
]

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User' },
]

export function UsersTable() {
  return <DataTable columns={columns} data={users} />
}
```

--------------------------------

### Complete Shadcn Table Example with Features (TSX)

Source: https://www.shadcntable.com/docs/components/data-table

This comprehensive example showcases a fully functional React Data Table using Shadcn UI components. It includes features like column definitions with filtering and custom cell rendering, data fetching simulation, pagination, row selection, and a toolbar with search and view options. This snippet requires various Shadcn UI components and core React concepts.

```tsx
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { DataTable } from '@/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/components/shadcntable/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type User = {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    meta: {
      filterConfig: {
        variant: 'text',
        placeholder: 'Filter names...',
      },
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
      )
    },
    meta: {
      filterConfig: {
        variant: 'select',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    role: 'User',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'inactive',
    role: 'User',
  },
]

export function UsersTable() {
  return (
    <DataTable
      columns={columns}
      data={users}
      pagination={{
        pageSize: 10,
        pageSizeOptions: [10, 25, 50],
      }}
      rowSelection={{
        onRowSelectionChange: (rows) => console.log('Selected:', rows),
      }}
      toolbar={{
        search: true,
        viewOptions: true,
      }}
    />
  )
}

```

--------------------------------

### DataTable Pagination Configuration

Source: https://www.shadcntable.com/docs/components/data-table

Shows how to configure pagination for the DataTable component. This example enables pagination and sets initial page size and available page size options. The `pagination` prop accepts a `DataTablePaginationConfig` object.

```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={{
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  }}
/>
```

--------------------------------

### Enable Row Selection in shadcn/table

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Demonstrates how to enable row selection in the DataTable component by passing the `rowSelection` prop. The example includes a callback function to handle selection changes.

```tsx
<DataTable
  columns={columns}
  data={users}
  rowSelection={{
    onRowSelectionChange: (selection) => console.log('Selected:', selection),
  }}
/>
```

--------------------------------

### Create Columns for shadcn/table (React/TypeScript)

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Defines the columns for the DataTable component using TanStack Table's ColumnDef. This example shows how to set up accessor keys and headers, leveraging a custom DataTableColumnHeader component for consistent styling.

```tsx
import { type ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/shadcntable/data-table-column-header'

type User = {
  id: string
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
  },
]
```

--------------------------------

### Add Column Filters to shadcn/table (React/TypeScript)

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Configures column filters for the DataTable using the `meta.filterConfig` property within `ColumnDef`. This example shows both text-based search and select-based filtering with customizable options and debouncing.

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    meta: {
      filterConfig: {
        title: 'Filter by name',
        variant: 'text',
        placeholder: 'Search names...',
        debounceMs: 300,
      },
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    meta: {
      filterConfig: {
        title: 'Filter by role',
        variant: 'select',
        placeholder: 'Select role...',
        options: [
          { label: 'Admin', value: 'Admin' },
          { label: 'Editor', value: 'Editor' },
          { label: 'User', value: 'User' },
        ],
      },
    },
  },
]
```

--------------------------------

### Add Number Range Filter to Table Column

Source: https://www.shadcntable.com/docs/components/data-table

Add a number range filter to a table column using `meta.filterConfig` with the 'number-range' variant. This allows users to filter data based on a minimum and maximum numerical value. It accepts a placeholder to guide user input.

```tsx
{
  accessorKey: 'age',
  header: ({ column }) => <DataTableColumnHeader column={column} title='Age' />,
  meta: {
    filterConfig: {
      title: 'Filter by age',
      variant: 'number-range',
      placeholder: 'Min - Max',
    },
  },
}
```

--------------------------------

### Add Sample Data for shadcn/table

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Provides sample data conforming to the defined User type. This data will be used to populate the DataTable component, demonstrating how to structure input for the table.

```typescript
type User = {
  id: string
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User' },
]
```

--------------------------------

### Basic DataTable Usage in React

Source: https://www.shadcntable.com/docs/components/data-table

Demonstrates the fundamental usage of the DataTable component in a React application. It defines user data structure, columns with headers, and renders the DataTable with sample data. Requires @tanstack/react-table and shadcn/ui components.

```tsx
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/components/shadcntable/data-table-column-header'

type User = {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
]

const data: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
]

export function MyTable() {
  return <DataTable columns={columns} data={data} />
}
```

--------------------------------

### Configure Pagination for shadcn/table

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Sets up pagination for the DataTable component by providing the `pagination` prop. This allows users to control the number of items displayed per page and select from predefined page size options.

```tsx
<DataTable
  columns={columns}
  data={users}
  pagination={{
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  }}
/>
```

--------------------------------

### Display Loading Skeleton While Fetching Data

Source: https://www.shadcntable.com/docs/components/data-table

Manage the initial data loading state by passing the `isLoading` prop to the `DataTable` component. When `isLoading` is true, it displays skeleton rows, providing visual feedback during the initial data fetch. This is typically controlled by a state variable.

```tsx
const [isLoading, setIsLoading] = useState(true)

<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
/>
```

--------------------------------

### DataTable Toolbar Configuration

Source: https://www.shadcntable.com/docs/components/data-table

Demonstrates how to configure the DataTable's toolbar to include search functionality and view options (like column visibility toggles). The `toolbar` prop accepts a `DataTableToolbarConfig` object.

```tsx
<DataTable
  columns={columns}
  data={data}
  toolbar={{
    search: true,
    viewOptions: true,
  }}
/>
```

--------------------------------

### Show Fetching Overlay with Spinner Over Existing Rows

Source: https://www.shadcntable.com/docs/components/data-table

Indicate background data fetching or updates using the `isFetching` prop on the `DataTable` component. When `isFetching` is true, an overlay with a spinner appears over the current data, useful for scenarios like background refreshes without losing sight of existing information. This is often used in conjunction with `isLoading`.

```tsx
import { useQuery } from '@tanstack/react-query'

function UsersTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', pagination],
    queryFn: async () => {
      const res = await fetch(`/api/users?page=${pagination.pageIndex + 1}`)
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  return (
    <DataTable
      columns={columns}
      data={data?.rows ?? []}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={{
        manual: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        rowCount: data?.rowCount ?? 0,
        onPaginationChange: setPagination,
      }}
    />
  )
}
```

--------------------------------

### DataTable Row Selection Configuration

Source: https://www.shadcntable.com/docs/components/data-table

Illustrates how to enable row selection in the DataTable using checkboxes. This snippet configures a callback `onRowSelectionChange` to log the selected rows. It also shows how to conditionally enable row selection based on row data.

```tsx
<DataTable
  columns={columns}
  data={data}
  rowSelection={{
    onRowSelectionChange: (selectedRows) => {
      console.log('Selected:', selectedRows)
    },
  }}
/>

<DataTable
  columns={columns}
  data={data}
  rowSelection={{
    enableRowSelection: (row) => row.original.status !== 'locked',
    onRowSelectionChange: (selectedRows) => {
      console.log('Selected:', selectedRows)
    },
  }}
/>
```

--------------------------------

### DataTable Column Header with Sorting and Filtering

Source: https://www.shadcntable.com/docs/components/data-table

Shows the usage of `DataTableColumnHeader` for creating sortable and filterable column headers. This component integrates with TanStack Table's sorting and filtering capabilities, providing a refined user experience for data exploration.

```tsx
import { DataTableColumnHeader } from '@/components/shadcntable/data-table-column-header'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
]
```

--------------------------------

### Handle DataTable Row Clicks

Source: https://www.shadcntable.com/docs/components/data-table

Implements a handler function for row clicks in the DataTable. This allows developers to define custom behavior, such as navigating to a specific user profile page, when a row is interacted with.

```tsx
<
DataTable
  columns={columns}
  data={data}
  onRowClick={(user) => {
    router.push(`/users/${user.id}`)
  }}
/>
```

--------------------------------

### Add Actions Column with Dropdown Menu (TSX)

Source: https://www.shadcntable.com/docs/components/data-table

This snippet demonstrates how to add an 'Actions' column to a React Data Table. It utilizes Shadcn UI's DropdownMenu component to provide a menu of actions for each row, such as copying an ID, viewing details, or deleting an item. Dependencies include Shadcn UI components and lucide-react icons.

```tsx
import { MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteUser(user.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

--------------------------------

### Add Custom Filter Component to Table Column

Source: https://www.shadcntable.com/docs/components/data-table

Create a custom filter for a table column by providing a React component to `meta.filterConfig.component`. This offers maximum flexibility for complex filtering logic. A corresponding `filterFn` is required to handle the filtering itself.

```tsx
{
  accessorKey: 'age',
  header: ({ column }) => <DataTableColumnHeader column={column} title='Age' />,
  meta: {
    filterConfig: {
      variant: 'custom',
      title: 'Age Filter',
      component: ({ value, onChange }) => {
        const isChecked = value === true

        return (
          <div className='flex items-center gap-2'>
            <Checkbox
              id='adults-only'
              checked={isChecked}
              onCheckedChange={(checked) => {
                onChange(checked === true)
              }}
            />
            <Label htmlFor='adults-only' className='text-sm font-normal cursor-pointer'>
              Adults only (18+)
            </Label>
          </div>
        )
      },
    },
  },
  filterFn: (row, columnId, filterValue) => {
    if (filterValue !== true) return true
    const age = row.getValue<number>(columnId)
    return age >= 18
  },
}
```

--------------------------------

### Add Text Filter to Table Column

Source: https://www.shadcntable.com/docs/components/data-table

Configure a text-based filter for a table column using `meta.filterConfig`. This allows users to search for specific text within a column. It accepts a placeholder and debounce delay for improved user experience.

```tsx
{
  accessorKey: 'name',
  header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  meta: {
    filterConfig: {
      title: 'Filter by name',
      description: 'Search for users by name',
      variant: 'text',
      placeholder: 'Enter name...',
      debounceMs: 300,
    },
  },
}
```

--------------------------------

### Add Select Filter to Table Column

Source: https://www.shadcntable.com/docs/components/data-table

Implement a select filter for a table column using `meta.filterConfig` with the 'select' variant. This is useful for columns with predefined options, such as status. It allows users to choose from a list of labels and their corresponding values.

```tsx
{
  accessorKey: 'status',
  header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
  meta: {
    filterConfig: {
      title: 'Filter by status',
      variant: 'select',
      placeholder: 'Select status...',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  },
}
```

--------------------------------

### Customize DataTable Empty State

Source: https://www.shadcntable.com/docs/components/data-table

Defines a custom empty state for the DataTable when no data is available. This allows for displaying a personalized message and actions, such as a refresh button, to the user.

```tsx
<
DataTable
  columns={columns}
  data={[]}
  emptyState={
    <div className='text-center py-10'>
      <p className='text-muted-foreground'>No users found</p>
      <Button onClick={() => refetch()}>Refresh</Button>
    </div>
  }
/>
```

--------------------------------

### Internationalize DataTable Text

Source: https://www.shadcntable.com/docs/components/data-table

Allows for full or partial internationalization of all text strings within the DataTable component using the `locale` prop. This enables users to override default labels for pagination, toolbar, view options, and more.

```tsx
<
DataTable
  columns={columns}
  data={data}
  locale={{
    body: {
      noResults: 'Aucun résultat',
    },
    pagination: {
      rowsSelected: 'ligne(s) sélectionnée(s).',
      rowsPerPage: 'Lignes par page',
      page: 'Page',
      of: 'sur',
      goToFirstPage: 'Aller à la première page',
      goToPreviousPage: 'Aller à la page précédente',
      goToNextPage: 'Aller à la page suivante',
      goToLastPage: 'Aller à la dernière page',
    },
    toolbar: {
      searchPlaceholder: 'Rechercher...', 
    },
    viewOptions: {
      view: 'Vue',
      toggleColumns: 'Basculer les colonnes',
    },
    rowSelection: {
      selectAll: 'Tout sélectionner',
      selectRow: 'Sélectionner la ligne',
    },
    columnHeader: {
      sortAscending: 'Trier par ordre croissant',
      sortDescending: 'Trier par ordre décroissant',
      clearSorting: 'Effacer le tri',
      hideColumn: 'Masquer la colonne',
      clearFilter: 'Effacer le filtre',
      sortMenuLabel: 'Basculer les options de tri',
      filterMenuLabel: 'Basculer les options de filtre',
    },
    filters: {
      multiSelect: {
        search: 'Rechercher...', 
        noResults: 'Aucun résultat trouvé.',
      },
      numberRange: {
        min: 'Min',
        max: 'Max',
      },
    },
  }}
/>
```

```tsx
<
DataTable
  columns={columns}
  data={data}
  locale={{
    body: {
      noResults: 'No data available',
    },
    pagination: {
      rowsPerPage: 'Items per page',
    },
  }}
/>
```

--------------------------------

### Add Date Range Filter to Table Column

Source: https://www.shadcntable.com/docs/components/data-table

Implement a date range filter for a table column using `meta.filterConfig` with the 'date-range' variant. This enables users to filter data within a specified date period. It includes a placeholder for user guidance.

```tsx
{
  accessorKey: 'createdAt',
  header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
  meta: {
    filterConfig: {
      title: 'Filter by date',
      variant: 'date-range',
      placeholder: 'Select date range...',
    },
  },
}
```

--------------------------------

### Customize DataTable Cell Rendering

Source: https://www.shadcntable.com/docs/components/data-table

Enables custom rendering of cell content within the DataTable. This is achieved by defining a `cell` function within the column definitions, allowing for the display of formatted data, badges, or other custom UI elements.

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
]
```

--------------------------------

### Define Data Type for shadcn/table

Source: https://www.shadcntable.com/docs/getting-started/quick-start

Defines the structure of a single data record for the DataTable component. This TypeScript type is crucial for ensuring type safety and correct data handling within the table.

```typescript
type User = {
  id: string
  name: string
  email: string
  role: string
}
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.