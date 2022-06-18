import Card from './Card'


interface ErrorReportingProps {
  message: string
}
export default function ErrorReporting({ message }: ErrorReportingProps) {
  return (
    <Card title='Error =('>
      <div className='overflow-x-auto'>
        <p>
          {message}
        </p>
      </div>
    </Card>
  )
}