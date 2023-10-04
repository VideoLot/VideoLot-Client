'use client'

import { Panel, VideoData } from '@videolot/videolot-prisma';
import { useEffect, useRef, useState } from 'react';
import Preview from '../preview';
import ArrowButton, { ArrowDirection } from '../arrow-button';
import { VIDEOS_LIST } from '@/app/constants';
import { post } from '@/utils/fetch';
import { PageOfVideos, PanelContentData } from '@/app/types';

export interface ClientPanelProps {
    pageSize: number
    page?: number
    totalPages?: number
    panel: Panel
    pageContent?: VideoData[]
}

type PageRange = {
    first?: number,
    last?: number
}

export default function ClientPanel(props: ClientPanelProps) {
    const contentPanelRef = useRef<HTMLDivElement>(null);
    const viewportPanelRef = useRef<HTMLDivElement>(null);
    const pagesRef = useRef<PageRange>({first: props.page, last: props.page});

    const [panelVideos, setPanelVideos] = useState<VideoData[]>(props.pageContent || []);
    const [totalPages, setTotalPages] = useState(props.totalPages || 1);
    const [leftArrowVisible, setLeftArrowVisible] = useState(true);
    const [rightArrowVisible, setRightArrowVisible]  = useState(true);
    const [panel, setPanel] = useState<Panel | null>(null);


    // after component mounted load content until panel is filled or content finished
    useEffect(() => {
        const loadUntilFull = async ()=> {
            const contentPanel = contentPanelRef.current;
            const viewportPanel = viewportPanelRef.current;
            
            if (!contentPanel || !viewportPanel) {
                return;
            }
    
            const pages = pagesRef.current;
    
            if(contentPanel.scrollWidth >= viewportPanel.clientWidth) { 
                handlePanelScroll();
                return; // panel is filled
            }
    
            let pageForLoad :number | null = props.page || 0;
            if (pages.first === undefined || pages.last === undefined) {

            } else {
                if (pages.last === totalPages - 1) {
                    if (pages.first !== 0) {
                        pageForLoad = pages.first - 1;
                    } else {
                        pageForLoad = null;
                    }
                } else {
                    pageForLoad = pages.last + 1;
                }
            }
    
            if (pageForLoad === null) {
                handlePanelScroll();
                return; // content is over
            }
            pagesRef.current = await loadPageOfVideo(pageForLoad, props.pageSize);
        }
        
        loadUntilFull();

    }, [panelVideos]);

    useEffect(()=> {
        if (panel) {
            const pages = pagesRef.current;
            if (!pages) {
                return;
            }
    
            pages.first = undefined;
            pages.last = undefined;
            setPanelVideos([]);
        }
        setPanel(props.panel);
    }, [props.panel]);


    const handlePanelScroll = async () => {
        const contentPanel = contentPanelRef.current;
        const viewportPanel = viewportPanelRef.current;
        const pages = pagesRef.current;
        if (!contentPanel || !viewportPanel) {
            return;
        }

        if (contentPanel.scrollLeft === 0) {
            if (pages.first !== 0) {
                pagesRef.current = await loadPageOfVideo(pages.first - 1, props.pageSize);
                setLeftArrowVisible(true);
            } else {
                setLeftArrowVisible(false)
            }
        } else {
            setLeftArrowVisible(true); 
        }

        if (contentPanel.scrollLeft >= (contentPanel.scrollWidth - contentPanel.clientWidth)) {
            if (pages.last < (props.totalPages - 1)) {
                pagesRef.current = await loadPageOfVideo(pages.last + 1, props.pageSize);
                setRightArrowVisible(true);
            } else {
                setRightArrowVisible(false);
            }
        } else {
            setRightArrowVisible(true);
        }
    }

    const handleLeftArrowClick = () => {
        const contentPanel = contentPanelRef.current;
        if (!contentPanel) {
            return;
        }

        const scrollTo = Math.max(0, contentPanel.scrollLeft - contentPanel.clientWidth);

        contentPanel.scrollTo({behavior: 'smooth', left: scrollTo});
    }

    const handleRightArrowClick = () => {
        const contentPanel = contentPanelRef.current;
        if (!contentPanel) {
            return;
        }

        const scrollTo = Math.min(contentPanel.scrollWidth - contentPanel.clientWidth, contentPanel.scrollLeft + contentPanel.clientWidth);

        contentPanel.scrollTo({behavior: 'smooth', left: scrollTo});
    }

    async function loadPageOfVideo(page: number, pageSize: number): Promise<PageRange> {
        const response = await post(VIDEOS_LIST)
        .withJsonBody(props.panel.content as unknown as PanelContentData)
        .withParams(
            {name: 'pageSize', value: pageSize.toString()},
            {name: 'page', value: page.toString()}
        ).send();

        if (response.ok) {
            let pages = {...pagesRef.current};
            const {videos, totalVideos} = await response.json() as unknown as PageOfVideos;
            let videoUpdate: VideoData[];
            if (pages.first !== undefined && pages.last !== undefined) {
                if (page < pages.first) {
                    videoUpdate = [...videos, ...panelVideos];
                    pages = {first: page, last: pages.last};
                }
                if (page > pages.last) {
                    videoUpdate = [...panelVideos, ...videos];
                    pages = ({first: pages.first, last: page});
                }
                else { 
                    videoUpdate = [...panelVideos];
                }
            } else {
                videoUpdate = videos;
                pages = {first: page, last: page};
            }

            setPanelVideos(videoUpdate)
            return pages;
        }
        return pagesRef.current;
    }

    return (
        <div>
            <div>
                <h2>{props.panel.title}</h2>
            </div>
            <div ref={viewportPanelRef} className='relative flex flex-row items-center'>
                {
                    leftArrowVisible ?                     
                        <div className='absolute -left-10 h-1/3 aspect-square z-50'>
                            <ArrowButton direction={ArrowDirection.Left} onClick={handleLeftArrowClick}></ArrowButton>
                        </div> 
                        : 
                        null
                }
                <div ref={contentPanelRef} onScroll={handlePanelScroll} className='flex flex-nowrap space-x-1 md:space-x-2 overflow-x-auto md:pb-1'>
                    { 
                        panelVideos.map((x)=> (
                        <Preview key={x.id} previewData={x}/>
                        ))
                    }
                </div>
                {
                    rightArrowVisible ?
                        <div className='absolute -right-10 h-1/3 aspect-square z-50'>
                            <ArrowButton direction={ArrowDirection.Right} onClick={handleRightArrowClick}></ArrowButton>
                        </div>
                        :
                        null
                }
            </div>              
        </div>);
}