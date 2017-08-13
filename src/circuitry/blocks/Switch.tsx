import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { offset } from '../../utils/textUtils';

type State = {
    current: number;
    steps: number;
}

export const Switch: BlockDescriptor<State> = {
    name: 'Switch',
    initialState: {
        current: 1,
        steps: 4,
    },
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                circuit.cooldown[inputId] = true;
                const oldSwitchTargetSide = circuit.switchTargetSide[blockId];
                for (let i = 1; i <= 4; ++i) {
                    const newSwitchTargetSide = (oldSwitchTargetSide + i) % 4;
                    if (circuit.isOutputPort[offset + newSwitchTargetSide]) {
                        circuit.outputGate[offset + newSwitchTargetSide] = true;
                        circuit.switchTargetSide[blockId] = newSwitchTargetSide;
                        return;
                    }
                }
            }
        }
    },
    component: (props) =>
        <Block  {...props}
            label={'\uf021'}
            labelX={13}
            labelY={11}
        >
            <Text key={1}
                text={`${props.current || ''}`}
                x={offset(props.current, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text key={2}
                text={`${props.steps || ''}`}
                x={offset(props.steps, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}