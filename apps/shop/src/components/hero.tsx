import { Button, Heading } from "@medusajs/ui";
import Link from "next/link";

type HeroProps = {
    hero: any;
};

const Hero = ({ hero }: HeroProps) => {
    // Determine the background image URL if a Media object is provided
    const backgroundImageUrl =
        hero?.backgroundImage && typeof hero.backgroundImage === "object"
            ? `url(${hero.backgroundImage.url})`
            : undefined;

    return (
        <div
            className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle"
            style={{
                backgroundImage: backgroundImageUrl,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
                <span>
                    <Heading
                        className="text-3xl leading-10 font-normal text-white"
                        level="h1"
                    >
                        {hero?.title}
                    </Heading>
                    <Heading
                        className="text-3xl leading-10 text-gray-300 font-normal"
                        level="h2"
                    >
                        {hero?.subtitle}
                    </Heading>
                </span>
                <Link href={hero?.ctaButtonLink || "/"}>
                    <Button size="large" variant="secondary">
                        {hero?.ctaButtonText}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Hero;
