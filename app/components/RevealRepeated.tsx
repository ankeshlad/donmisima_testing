import React, {useRef, useEffect, useState} from "react"
import {motion, useInView, useAnimation} from "framer-motion"

interface Props {
    children: JSX.Element;
    width?: "fit-content" | "100%";
    delay?: number;
    repeat_handler?: boolean;
}

const RevealRepeated = ({children, width = "fit-content", delay = 0.25, repeat_handler = false}: Props) => {

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    const [style, setStyle] = useState("reveal-relative reveal-hidden")
    const [repeat, setRepeat] = useState(repeat_handler)

    const mainControls = useAnimation()

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
            setTimeout(() => {
                setStyle("reveal-relative")
                setRepeat(false)
            }, 750)
        }
    }, [isInView, repeat])

    return (
        <div ref={ref} style={{width}} className={style}>
        <motion.div
        variants={{
            hidden: {opacity: 0, y: "20%"},
            visible: {opacity: 1, y: 0},
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: delay }}
        >{children}</motion.div>
        </div>
    )
};

export default RevealRepeated;
