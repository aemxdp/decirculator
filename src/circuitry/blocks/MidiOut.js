import React from 'react';
import { Text } from 'react-konva';
import Block from '../../components/Block';
import utils from '../../utils';

export default {
    name: 'MidiOut',
    initialData: {
        channel: 1,
        note: 64,
        velocity: 100,
    },
    tick: (circuit, blockId, delta, config) => {
        if (circuit.cooldown[blockId]) {
            const timeUntilTurnOff = circuit.timeUntilTurnOff[blockId] -= delta;
            if (timeUntilTurnOff <= 0) {
                circuit.onMidiOut(false, circuit.channel[blockId], circuit.note[blockId], circuit.velocity[blockId]);
                circuit.cooldown[blockId] = false;
            }
        }
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                circuit.onMidiOut(true, circuit.channel[blockId], circuit.note[blockId], circuit.velocity[blockId]);
                circuit.timeUntilTurnOff[blockId] = config.gateLength;
                circuit.changed[blockId] = true;
                circuit.cooldown[blockId] = true;
                circuit.cooldown[inputId] = true;
                return;
            }
        }
    },
    component: (props) =>
        <Block {...props}
            label={'\uf176'}
            labelX={18}
            labelY={9}
            labelFontSize={30}
        >
            <Text key={1}
                text={props.channel}
                x={utils.text.offset(props.channel, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text key={2}
                text={props.value}
                x={utils.text.offset(props.value, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}