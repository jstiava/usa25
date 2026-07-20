'use client'

import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import useEventListener from './useEventListener';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

const Cursor = React.forwardRef(function NoRef(props, ref) {
  const [{ clientX, clientY }, setPosition] = React.useState({
    clientX: 0,
    clientY: 0
  });
  useEventListener("mousemove", ({ clientX, clientY }) =>
    setPosition({ clientX, clientY })
  );
  return (
    <div
      ref={ref}
      {...props}
      style={{
        position: "fixed",
        pointerEvents: "none",
        top: `${clientY}px`,
        left: `${clientX}px`
      }}
    />
  );
});

export default function CursorHoverCard({
  hovering
}: {
  hovering : string | null
}) {
  const [content, setContent] = React.useState<string>('This is the content')

  return (
    <TooltipProvider>
      <Tooltip open={Boolean(hovering)} key={hovering}>
        <TooltipTrigger asChild={true}>
          <Cursor />
        </TooltipTrigger>
        <TooltipContent sideOffset={5} side="right">
          <span style={{ backgroundColor: "white", fontSize: "30px" }}>
            This is a test
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

}
