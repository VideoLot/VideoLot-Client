
import HorizontalVideoPanel from '@/app/components/horizontal-panel'
import RootPanel from './components/root-panel'

export default function Home() {
  return (
    <div className="flex flex-col justify-between p-4 md:p-10">
      <RootPanel path='/'></RootPanel>
    </div>
  )
}
