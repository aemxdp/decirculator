import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { CircuitObjectsState } from './circuitObjectsReducer';
import { shapeCenter } from '../utils/geometryUtils';
import * as circuitObjectsActions from '../actions/CircuitObjectsAction';
import {
    UiAction, DRAG_VIEWPORT, DRAG_BLOCKS, SELECT_OBJECTS,
    HOVER_PORT, DRAW_WIRE, CANCEL_DRAWING_WIRE, PLACE_PIVOT
} from '../actions/UiAction';

export interface UiState {
    viewportOffset: Point;
    selectedObjectIds: Set<number>;
    hoveringPortInfo?: PortInfo;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
    pivotPosition: Point;
}

type Action
    = UiAction
    | circuitObjectsActions.CreateBlock
    | circuitObjectsActions.CreateWire;

export function uiReducer(uiState: UiState, circuitObjectsState: CircuitObjectsState, action: Action): UiState {
    switch (action.type) {
        case DRAG_VIEWPORT:
            return {
                ...uiState,
                viewportOffset: action.newOffset,
            };
        case DRAG_BLOCKS:
            if (action.ids.size === 1 && action.ids.has(NaN) && uiState.newBlock) {
                return {
                    ...uiState,
                    newBlock: {
                        ...uiState.newBlock,
                        x: uiState.newBlock.x + action.offset.x,
                        y: uiState.newBlock.y + action.offset.y,
                    }
                };
            } else {
                return uiState;
            }
        case SELECT_OBJECTS:
            return {
                ...uiState,
                selectedObjectIds: action.ids,
            };
        case HOVER_PORT:
            return {
                ...uiState,
                hoveringPortInfo: action.portInfo,
            };
        case DRAW_WIRE:
            const hpi = uiState.hoveringPortInfo;
            if (uiState.newWire) {
                return {
                    ...uiState,
                    newWire: {
                        ...uiState.newWire,
                        endPosition: hpi
                            ? shapeCenter(hpi.port, circuitObjectsState.blockById[hpi.blockId])
                            : action.endPosition || uiState.newWire.startPosition,
                        endPortInfo: hpi,
                    },
                };
            } else if (hpi) {
                const startPosition = shapeCenter(hpi.port, circuitObjectsState.blockById[hpi.blockId]);
                return {
                    ...uiState,
                    newWire: {
                        id: NaN,
                        kind: 'wire',
                        active: true,
                        startPosition,
                        startPortInfo: hpi,
                        endPosition: startPosition,
                        endPortInfo: undefined,
                        gate: false,
                    },
                };
            } else {
                return uiState;
            }
        case CANCEL_DRAWING_WIRE:
            return {
                ...uiState,
                newWire: undefined,
            };
        case PLACE_PIVOT:
            return {
                ...uiState,
                pivotPosition: action.pivotPosition,
            };
        case circuitObjectsActions.CREATE_BLOCK:
            return {
                ...uiState,
                newBlock: undefined,
            };
        case circuitObjectsActions.CREATE_WIRE:
            return {
                ...uiState,
                newWire: undefined,
            };
        default:
            return uiState;
    }
}
