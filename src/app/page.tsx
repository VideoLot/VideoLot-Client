
import HorizontalVideoPanel from '@/app/components/horizontal-panel'

export default function Home() {
  return (
    <div className="flex flex-col justify-between p-4 md:p-10">
      <HorizontalVideoPanel title='First Group' tags={['video']}></HorizontalVideoPanel>
      <HorizontalVideoPanel title='Second Group' tags={['video']}></HorizontalVideoPanel>
      <HorizontalVideoPanel title='Third Group' tags={['video']}></HorizontalVideoPanel>
      <HorizontalVideoPanel title='Forth Group' tags={['video']}></HorizontalVideoPanel>
    </div>
  )
}
