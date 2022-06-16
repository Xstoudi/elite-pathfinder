import { ReactNode } from 'react'

interface CardProps {
    title: string | ReactNode,
    rightTitle?: string | ReactNode,
    children: React.ReactNode
}
export default function Card({title, rightTitle = '', children}: CardProps){
  return (
    <div className='card bg-base-100 shadow-xl mx-8 w-full md:w-1/2 xl:w-1/2 overflow-visible mb-8' data-theme='dracula'>
      <div className='card-body'>
        <div className='flex place-content-between'>
          <h2 className='card-title'>{title}</h2>
          {rightTitle}
        </div>
        {children}
      </div>
    </div>
  )
}