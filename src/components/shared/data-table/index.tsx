import { CircularProgress } from '@mui/material'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'

interface DataTableProps extends Omit<DataGridProps, 'rows' | 'columns' | 'loading' | 'onPaginationModelChange'> {
  data: any
  columns: any
  page?: number
  pageSize?: number
  isLoading: boolean
  onPaginationModelChange?: (newModel: any) => void
  checkboxSelection?: boolean
  disableRowSelectionOnClick?: boolean
  isRowSelectable?: (params: any) => boolean
  onRowSelectionModelChange?: (ids: any) => void
}

const DataTable = (props: DataTableProps) => {
  const { data, columns, page, pageSize, isLoading, onPaginationModelChange, ...rest } = props

  return (
    <DataGrid
      {...rest}
      autoHeight
      getRowHeight={() => 'auto'}
      rows={data?.entries ?? []}
      columns={columns}
      pagination
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      rowCount={data?.totalData ?? 0}
      initialState={{
        pagination: {
          paginationModel: {
            page: (page ?? 0) - 1,
            pageSize: pageSize ?? 10
          }
        }
      }}
      onPaginationModelChange={onPaginationModelChange}
      loading={isLoading}
      slots={{
        loadingOverlay: CircularProgress
      }}
      sx={{
        border: '1px solid #F5F5F7',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#F5F5F7',
          borderRadius: '10px !important'
        },
        '& .MuiDataGrid-cell': {
          padding: '8px',
          whiteSpace: 'normal !important',
          wordWrap: 'break-word !important',
          minHeight: 'auto !important'
        },
        '& .MuiDataGrid-row': {
          maxHeight: 'none !important'
        }
      }}
    />
  )
}

export default DataTable
