import Dashboard from 'src/libs/dashboard/containers'

const DashboardPage = () => {
  return <Dashboard />
}

DashboardPage.acl = {
  subject: 'all',
  action: 'VIEW'
}

export default DashboardPage
