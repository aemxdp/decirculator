import React from 'react';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';

type State = {
    targetSide: number;
};

export const Switch: BlockDescriptor<State> = {
    name: 'Switch',
    initialState: {
        targetSide: 0,
    },
    statePropsToResetAfterSimulation: [
        'targetSide',
    ],
    editableStateProps: [
        { propKey: 'targetSide', propType: 'number' }
    ],
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && circuit.gate[inputId]) {
                const oldSwitchTargetSide = circuit.switchTargetSide[blockId];
                for (let j = 1; j <= 4; ++j) {
                    const newSwitchTargetSide = (oldSwitchTargetSide + j) % 4;
                    if (circuit.isOutputPort[offset + newSwitchTargetSide]) {
                        circuit.outputGate[offset + newSwitchTargetSide] = true;
                        circuit.switchTargetSide[blockId] = newSwitchTargetSide;
                        circuit.changed[blockId] = true;
                        return;
                    }
                }
            }
        }
    },
    component: (props) =>
        <Block
            {...props}
            label={'\uf021'}
            labelX={13}
            labelY={11}
        />
};
