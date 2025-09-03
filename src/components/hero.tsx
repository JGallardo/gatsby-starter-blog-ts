/**
 * Hero component that shows a featured image that reflects the theme
 */

import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <StaticImage
        className="hero-bg"
        layout="constrained"
        formats={["auto", "webp", "avif"]}
        src="../images/hero-bg.png"
        quality={95}
        alt="Hero Image"
      />
    </div>
  )
}

export default Hero
