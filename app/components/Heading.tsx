import Reveal from "./Reveal";

interface HeadingProps{
    heading: string;
}

const Heading = ({heading}: HeadingProps) => {
    return(
        <div className="heading">
                <div className="divider1"></div>
                    <h1>{heading}</h1>
                <div className="divider2"></div>
        </div>
    )
}

export default Heading;