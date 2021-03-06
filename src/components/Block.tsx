import React from 'react';
import ReactKonva from 'react-konva';
import { Port } from './Port';
import { portLocationInfos } from '../data/PortLocationInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { CircuitObjectVisuals } from '../data/CircuitObjectVisuals';

const { Group, Rect, Text }: any = ReactKonva;

type BlockEventListener =
    (event: Event, block: BlockCircuitObject) => void;

type EventListeners = {
    onDragStart: BlockEventListener;
    onDragEnd: BlockEventListener;
    onDragMove: BlockEventListener;
    onClick: BlockEventListener;
    onMouseEnter: BlockEventListener;
    onMouseLeave: BlockEventListener;
};

type Props = Partial<EventListeners> & BlockCircuitObject & CircuitObjectVisuals;

export class Block extends React.Component<Props, any> {
    static width = 50;
    static height = 50;
    static strokeWidth = 4;
    handleDragStart = (e: Event) => {
        if (this.props.onDragStart) {
            this.props.onDragStart(e, this.props);
        }
    }
    handleDragEnd = (e: Event) => {
        if (this.props.onDragEnd) {
            this.props.onDragEnd(e, this.props);
        }
    }
    handleDragMove = (e: Event) => {
        if (this.props.onDragMove) {
            this.props.onDragMove(e, this.props);
        }
    }
    handleClick = (e: Event) => {
        if (this.props.onClick) {
            this.props.onClick(e, this.props);
        }
    }
    handleMouseEnter = (e: Event) => {
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(e, this.props);
        }
    }
    handleMouseLeave = (e: Event) => {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(e, this.props);
        }
    }
    render() {
        return (
            <Group
                x={this.props.x}
                y={this.props.y}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
                onClick={this.handleClick}
            >
                <Group
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <Rect
                        width={Block.width}
                        height={Block.height}
                        strokeWidth={Block.strokeWidth}
                        stroke={this.props.isSelected
                            ? this.props.theme.selectionColor
                            : this.props.theme.blockOutlineColor
                        }
                        fill={this.props.active
                            ? this.props.theme.blockFillColor
                            : this.props.theme.inactiveColor
                        }
                    />
                    <Text
                        x={this.props.labelX}
                        y={this.props.labelY}
                        fontFamily={this.props.theme.blockFont}
                        fontSize={this.props.labelFontSize || 28}
                        fill={this.props.theme.blockTextColor}
                        text={this.props.label}
                    />
                    {this.props.children}
                </Group>
                {portLocationInfos.map(pli =>
                    <Port
                        {...pli}
                        key={pli.side.name}
                        theme={this.props.theme}
                        direction={this.props.ports[pli.side.name]}
                        isHovering={
                            this.props.hoveringPort
                                ? pli.side === this.props.hoveringPort.side
                                : false
                        }
                    />
                )}
            </Group>
        );
    }
}
