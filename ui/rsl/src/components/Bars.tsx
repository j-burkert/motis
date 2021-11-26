import React from 'react';
import { PaxMonEdgeLoadInfoWithStats } from '../data/loadInfo';

type barProps = {
    edges: PaxMonEdgeLoadInfoWithStats[];
    spacing: number;
};

function Bars({edges, spacing}: barProps) : JSX.Element {
    const xPos = 200;
    const width = 200;

    const greenX = xPos;
    const yellowX = xPos + 0.8 * width * 0.5;
    const redX = xPos + width * 0.5;
    const darkRedX = xPos + 2 * width * 0.5;

    return(
        <svg>

            {edges.map((e, id) => {
                let yPos = spacing * id + 5 + 30;
                return(
                    <React.Fragment key={"bar-" + id}>
                        <rect 
                            key={"darkRed-" + id} 
                            x={darkRedX} 
                            y={yPos} 
                            width={width - darkRedX} 
                            height={spacing}
                            stroke="#DDD"
                            fill="#f57a7a"
                        />
                        <rect 
                            key={"green-" + id} 
                            x={greenX} 
                            y={yPos} 
                            width={yellowX - greenX} 
                            height={spacing}
                            stroke="#DDD"
                            fill="#D4FFCA"
                        />
                        <rect
                            key={"yellow-" + id} 
                            x={yellowX} 
                            y={yPos}
                            width={redX - yellowX}
                            height={spacing}
                            stroke="#DDD"
                            fill="#FFF3CA"
                        />
                        <rect 
                            key={"red-" + id}
                            x={redX} y={yPos} 
                            width={darkRedX - redX} 
                            height={spacing}
                            stroke="#DDD"
                            fill="#FFCACA"
                        />

                        <path stroke-width="3" stroke="blue" d={`M ${e.expected_passengers / e.capacity * 0.5 * width + xPos} ${yPos} V ${yPos + spacing}`}/>
                        <path strokeWidth="3" stroke="blue" d={`M ${e.q_50 / e.capacity * 0.5 * width + xPos} ${yPos} V ${yPos + spacing}`}/>
                        
                        <text fontSize="small" x={xPos + width + 3} y={yPos + spacing / 2 + 5}>{(e.p_load_gt_100 * 100).toFixed(0) + "%"}</text>

                        <path stroke="grey" d={`M ${xPos} ${yPos} H ${xPos + width}`}/>
                    </React.Fragment>
                   
                );
            })}

            <text fontSize="small" x={greenX} y="30" transform={`rotate(300, ${greenX}, 30)`}>{0}</text>
            <text fontSize="small" x={yellowX} y="30" transform={`rotate(300, ${yellowX}, 30)`}>{Math.round(0.8 * edges[0].capacity)}</text>
            <text fontSize="small" x={redX} y="30" transform={`rotate(300, ${redX}, 30)`}>{Math.round(edges[0].capacity)}</text>
            <text fontSize="small" x={xPos + width} y="30" transform={`rotate(300, ${xPos + width}, 30)`}>{Math.round(edges[0].capacity * 2)}</text>
            
        </svg>
    ); 
};

export default Bars;