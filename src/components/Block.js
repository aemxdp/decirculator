import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import Side from '../data/Side';
import Port from './Port';

export default class extends React.Component {
    static DefaultPorts = {
        [Side.Top]: 'in',
        [Side.Right]: 'in',
        [Side.Bottom]: 'in',
        [Side.Left]: 'in',
    };
    static HoverZones = class extends React.Component {
        static defaultProps = {
            onPortMouseEnter: () => { },
            onPortMouseLeave: () => { },
            onPortClick: () => { },
        }
        handlePortMouseEnter = (e, port) => {
            this.props.onPortMouseEnter(e, this.props, port);
        }
        handlePortMouseLeave = (e, port) => {
            this.props.onPortMouseLeave(e, this.props, port);
        }
        handlePortClick = (e, port) => {
            this.props.onPortClick(e, this.props, port);
        }
        render() {
            return (
                <Group
                    x={this.props.x}
                    y={this.props.y}
                >
                    {Object.values(Port.LocationInfo).map(pli =>
                        <Port.HoverZones {...pli}
                            key={pli.side}
                            onClick={this.handlePortClick}
                            onMouseEnter={this.handlePortMouseEnter}
                            onMouseLeave={this.handlePortMouseLeave}
                        />
                    )}
                </Group>
            );
        }
    }
    static defaultProps = {
        onDragStart: () => { },
        onDragEnd: () => { },
        onDragMove: () => { },
        onClick: () => { },
    }
    handleDragStart = (e) => {
        this.props.onDragStart(e, this.props);
    }
    handleDragEnd = (e) => {
        this.props.onDragEnd(e, this.props);
    }
    handleDragMove = (e) => {
        this.props.onDragMove(e, this.props);
    }
    handleClick = (e) => {
        this.props.onClick(e, this.props);
    }
    render() {
        return (
            <Group
                x={this.props.x}
                y={this.props.y}
                draggable={!this.props.hoveringPort}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
                onClick={this.handleClick}
            >
                <Group
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}
                >
                    <Rect
                        width={50}
                        height={50}
                        strokeWidth={4}
                        stroke={this.props.isSelected ? 'orange' : 'black'}
                    />
                    <Text
                        x={4} y={11}
                        fontSize={30}
                        text={this.props.label}
                    />
                    {this.props.children}
                </Group>
                {Object.values(Port.LocationInfo).map(pli =>
                    <Port {...pli}
                        key={pli.side}
                        direction={this.props.ports[pli.side]}
                        isHovering={this.props.hoveringPort &&
                            pli.side === this.props.hoveringPort.side}
                    />
                )}
            </Group>
        );
    }
}