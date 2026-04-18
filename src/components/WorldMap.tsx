import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { PaperCutout } from './PaperCutout';
import { SwipeProfiles } from './SwipeProfiles';

const WORLD_JSON = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Mock city data
const CITIES = [
  { id: 'nyc', name: 'New York', coords: [-74.006, 40.7128], count: 124 },
  { id: 'london', name: 'London', coords: [-0.1276, 51.5074], count: 89 },
  { id: 'berlin', name: 'Berlin', coords: [13.405, 52.52], count: 56 },
  { id: 'tokyo', name: 'Tokyo', coords: [139.6917, 35.6895], count: 42 },
  { id: 'sydney', name: 'Sydney', coords: [151.2093, -33.8688], count: 31 },
  { id: 'mexico_city', name: 'Mexico City', coords: [-99.1332, 19.4326], count: 75 },
  { id: 'mumbai', name: 'Mumbai', coords: [72.8777, 19.076], count: 64 },
  { id: 'nairobi', name: 'Nairobi', coords: [36.8219, -1.2921], count: 28 },
];

export const WorldMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[0] | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [worldData, setWorldData] = useState<any>(null);

  const PINK_TAX_FACTS = [
    "The 'Pink Tax' refers to the extra amount women pay for everyday products like razors, shampoo, and clothes.",
    "On average, women pay 13% more for personal care products than men for nearly identical items.",
    "In a lifetime, an average woman may pay over $40,000 extra due to gender-based price discrimination.",
    "Some states are now passing laws to ban gender-based pricing on services like dry cleaning and haircuts.",
    "The gap is often most visible in children's toys—girls' toys can cost 7% more than matching boys' toys."
  ];

  const [factIndex] = useState(() => Math.floor(Math.random() * PINK_TAX_FACTS.length));

    // Effect for initial data loading
    useEffect(() => {
        const startTime = Date.now();
        const minLoadingMs = 4500;
        
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / minLoadingMs) * 100, 100);
            setLoadingProgress(progress);
        }, 50);

        d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
            .then((data: any) => {
                setWorldData(data);
                const fetchEndTime = Date.now();
                const elapsed = fetchEndTime - startTime;
                const remaining = Math.max(0, minLoadingMs - elapsed);

                setTimeout(() => {
                    setIsLoading(false);
                    clearInterval(progressInterval);
                }, remaining);
            })
            .catch(err => {
                console.error('Map data fetch failed:', err);
                setIsLoading(false);
                clearInterval(progressInterval);
            });

        return () => clearInterval(progressInterval);
    }, []);

    useEffect(() => {
      if (!svgRef.current || !containerRef.current || !worldData) return;

      const updateDimensions = () => {
        if (!containerRef.current || !worldData) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        if (width === 0 || height === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        
        const baseScale = width < 768 
          ? (height > width ? height / 1.6 : width / 1.6) 
          : (Math.min(width, height) / 2.5);

        const projection = d3.geoNaturalEarth1()
          .scale(baseScale)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);
        const g = svg.append('g');

        // Zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
                setZoomLevel(event.transform.k);
            });

        svg.call(zoom);

        const countries = feature(worldData, worldData.objects.countries) as any;

        // Continent coloring logic
        const getPaperColor = (d: any) => {
            const id = parseInt(d.id) || 0;
            const colors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F2AEB4'];
            return colors[id % colors.length];
        };

        g.selectAll('.country')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path as any)
            .attr('fill', d => getPaperColor(d))
            .attr('stroke', '#FDFBF7')
            .attr('stroke-width', 0.8)
            .style('filter', 'drop-shadow(2px 2px 0px rgba(0,0,0,0.1))')
            .on('mouseover', function() {
                d3.select(this).attr('opacity', 0.85);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 1);
            });

        // Add cities
        const cityGroup = g.append('g').attr('class', 'cities');
        const cities = cityGroup.selectAll('.city-item')
            .data(CITIES)
            .enter()
            .append('g')
            .attr('class', 'city-item');

        // Visual circle
        cities.append('circle')
            .attr('class', 'city-visual')
            .attr('cx', d => projection(d.coords as [number, number])![0])
            .attr('cy', d => projection(d.coords as [number, number])![1])
            .attr('r', d => Math.sqrt(d.count) / 1.5)
            .attr('fill', '#FF8C94')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))')
            .style('pointer-events', 'none');

        // Invisible hit-area circle
        cities.append('circle')
            .attr('class', 'city-hit-area')
            .attr('cx', d => projection(d.coords as [number, number])![0])
            .attr('cy', d => projection(d.coords as [number, number])![1])
            .attr('r', d => (Math.sqrt(d.count) / 1.5) + 12)
            .attr('fill', 'transparent')
            .attr('cursor', 'pointer')
            .on('mouseenter', function(event, d) {
                const group = d3.select(this.parentNode as any);
                group.select('.city-visual')
                    .transition()
                    .duration(200)
                    .attr('r', (Math.sqrt(d.count) / 1.5) * 1.3)
                    .attr('fill', '#FF4D6D');
                setSelectedCity(d);
            })
            .on('mouseleave', function(event, d) {
                const group = d3.select(this.parentNode as any);
                group.select('.city-visual')
                    .transition()
                    .duration(300)
                    .attr('r', Math.sqrt(d.count) / 1.5)
                    .attr('fill', '#FF8C94');
                setSelectedCity(null);
            })
            .on('click', (event, d) => {
                setSelectedCity(d);
                setIsSwiping(true);
            });
      };

      updateDimensions();
      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [worldData]);

    if (isSwiping && selectedCity) {
        return (
            <div className="h-[100dvh] flex flex-col p-6 md:p-8 bg-[#FDFBF7] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={() => setIsSwiping(false)}
                        className="text-[#5A5A40] font-display flex items-center gap-2 text-xl hover:translate-x-[-4px] transition-transform"
                    >
                        ← Back to Map
                    </button>
                    <h2 className="text-2xl md:text-3xl font-display text-[#5A5A40]">Women in {selectedCity.name}</h2>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        <SwipeProfiles cityName={selectedCity.name} />
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="w-full h-full relative bg-[#A1C9EA]/20 overflow-hidden" ref={containerRef}>
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
              <motion.div 
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7] p-4"
              >
                  <div className="flex flex-col items-center gap-8 max-w-lg px-8 text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-[#FFB7B2]/20 rounded-full" />
                        <motion.div 
                            className="absolute inset-0 border-4 border-[#FFB7B2] border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="font-hand text-2xl text-[#5A5A40] animate-pulse">Tracing the global map...</p>
                            <div className="w-64 h-2 bg-[#FFB7B2]/20 rounded-full mx-auto overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#FFB7B2]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                        </div>

                        <PaperCutout color="bg-white" className="p-6">
                            <div className="space-y-3">
                                <h4 className="font-display text-xl text-[#FFB7B2] uppercase tracking-wider">Did you know?</h4>
                                <p className="font-hand text-lg text-[#5A5A40] leading-relaxed italic">
                                    "{PINK_TAX_FACTS[factIndex]}"
                                </p>
                            </div>
                        </PaperCutout>
                    </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Controls (Top Right to avoid sidebar overlap) */}
        <div className="absolute top-32 right-8 z-20 pointer-events-none">
            <AnimatePresence>
                {showInfo && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="pointer-events-auto"
                    >
                        <div className="relative">
                            <PaperCutout color="bg-white" className="p-6 max-w-xs">
                                <h2 className="text-3xl font-display text-[#5A5A40] leading-tight mb-2 pr-6">Explore the Sisterhood</h2>
                                <p className="font-hand text-lg text-[#8E9299]">Click a city to meet women in that region. Every dot is a story.</p>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF8C94]" />
                                    <span className="text-xs font-hand text-[#5A5A40]">Communities found</span>
                                </div>
                            </PaperCutout>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowInfo(false);
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white text-black border border-[#5A5A40]/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all z-30 pointer-events-auto"
                                aria-label="Close information"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        
        {/* Legend / Hover Tooltip (Bottom Center-ish) */}
        <AnimatePresence>
          {selectedCity && !isSwiping && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
              >
                  <div className="relative">
                      <PaperCutout color="bg-[#FFDAC1]" className="w-64 p-6">
                          <h3 className="text-2xl font-display text-[#5A5A40]">{selectedCity.name}</h3>
                          <p className="font-hand text-xl text-[#8E9299]">{selectedCity.count} friendly sisters</p>
                          <button 
                            className="w-full mt-4 py-3 bg-[#FFB7B2] rounded-full font-display text-white paper-shadow hover:translate-y-[-2px] transition-transform"
                            onClick={() => setIsSwiping(true)}
                          >
                              Meet Them!
                          </button>
                      </PaperCutout>
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCity(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white text-black border border-[#5A5A40]/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all z-30"
                      >
                        <X size={18} />
                      </button>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Level Indicator (Bottom Left) */}
        <div className="absolute bottom-8 left-8 bg-black/5 backdrop-blur-sm px-4 py-2 rounded-full font-hand text-sm text-[#5A5A40] border border-black/5 z-20">
            Scroll to zoom • {zoomLevel.toFixed(1)}x
        </div>
      </div>
    );
  };
