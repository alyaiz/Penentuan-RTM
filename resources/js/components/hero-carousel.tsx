/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface Slide {
    id: number;
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    image: string;
}

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const slides: Slide[] = [
        {
            id: 1,
            badge: 'Launching Soon',
            title: 'Gapura Selamat Datang',
            description: 'Gapura selamat datang di kota lama dibangun pada awal tahun 2018 dan masih dalam proses pembangunan',
            buttonText: 'Get Started',
            image: '/assets/images/hero-3.jpg',
        },
        {
            id: 2,
            badge: 'Innovation Hub',
            title: 'Pendopo Kridha Wicaksana',
            description: 'Merupakan bangunan yang dirancang oleh arsitektur pribumi sendiri',
            buttonText: 'Learn More',
            image: '/assets/images/hero-2.jpg',
        },
        {
            id: 3,
            badge: 'Success Stories',
            title: 'Tapak Tilas',
            description: 'Merupakan tempat bersemayamnya abu eyang ronggolawe',
            buttonText: 'View Portfolio',
            image: '/assets/images/hero-1.jpg',
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    // const prevSlide = () => {
    //     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    // };

    const goToSlide = (index: number): void => {
        setCurrentSlide(index);
    };

    useEffect((): (() => void) => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative aspect-[9/16] md:aspect-[16/10] lg:aspect-[16/7] w-full overflow-hidden rounded-xl">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${slide.image})`,
                        }}
                    />
                </div>
            ))}

            <div className="relative z-8 mx-auto flex h-full max-w-7xl items-center justify-center">
                <div className="mx-auto max-w-4xl px-6 text-center text-white md:px-12">
                    <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{slides[currentSlide].title}</span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-gray-200">"{slides[currentSlide].description}"</p>
                </div>
            </div>

            {/* <button
                onClick={prevSlide}
                className="group absolute top-1/2 left-6 z-20 -translate-y-1/2 transform rounded-full border border-white/30 bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
            >
                <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <button
                onClick={nextSlide}
                className="group absolute top-1/2 right-6 z-20 -translate-y-1/2 transform rounded-full border border-white/30 bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
            >
                <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </button> */}

            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform space-x-3">
                {slides.map((_, index: number) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1 w-1 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>

            {/* <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/20">
                <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-5000 ease-linear"
                    style={{
                        width: `${((currentSlide + 1) / slides.length) * 100}%`,
                    }}
                />
            </div> */}
        </div>
    );
}
