import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch } from 'react-redux'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { checkAccess } from 'src/utils/checkAccess'
import moment from 'moment'
import { RootState } from 'src/stores'
import { formatString, getStatus } from 'src/utils'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DialogDetail from '../dialogs/DialogDetail'
import DialogVerification from '../dialogs/DIalogVerifiacation'
import { getAllCertificateLegalization } from 'src/stores/certificate-legalization/certificateLegalizationAction'
import { useTable } from '../../hooks/useTable'
import HeaderPage from 'src/components/shared/header-page'
import Can from 'src/components/acl/Can'
import DataTable from 'src/components/shared/data-table'

export default function CertificateLegalizationTable() {
  const router = useRouter()

  const {
    data,
    isLoading,
    page,
    pageSize,
    itemSelected,
    isVerificationOpen,
    isDetailOpen,
    columns,
    setPage,
    setPageSize,
    setIsVerificationOpen,
    setIsDetailOpen
  } = useTable()

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

  return (
    <>
      <Card>
        <HeaderPage
          title='Pengajuan Legalisir Ijazah'
          isDetail={false}
          action={
            <Can I='CREATE' a='LEGALISIR_IJAZAH'>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Icon icon='ic:baseline-add' />}
                onClick={() => router.push('/legalisir-ijazah/create')}
              >
                Buat Pengajuan
              </Button>
            </Can>
          }
        />

        <CardContent style={{ paddingInline: '0px' }}>
          <DataTable
            data={data}
            columns={columns}
            onPaginationModelChange={onPaginationModelChange}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
          />
        </CardContent>
      </Card>

      <DialogVerification
        open={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        values={itemSelected}
      />

      <DialogDetail open={isDetailOpen} onClose={(v: boolean) => setIsDetailOpen(v)} values={itemSelected} />
    </>
  )
}
