'use client'

import dynamic from 'next/dynamic'

// react-markdown + the remark/micromark pipeline it drags in are only needed
// once the widget mounts — keep them off every page's critical path.
export default dynamic(() => import('./ChatAssistant'), { ssr: false })
