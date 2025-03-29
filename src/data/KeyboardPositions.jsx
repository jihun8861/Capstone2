export const KEYBOARD_POSITIONS = {
  scales: {
    "60": 30,
    "80": 28,
    "100": 28
  },
  initialPositions: {
    "60": {
      base: [
        [-1.5, 0, 0],   // BottomCase
        [-1.5, 1.5, 0.2], // PCB
        [-1.5, 2.3, 0.3], // Plate
        [-1.5, 3.1, 0.4], // Screw
        [-1.5, 3.9, 0.5], // TopCase
        [-1.5, 4.7, 0.6]  // Stabilizers
      ],
      switch: [-1.5, 3, 0],
      keycap: [-1.5, 3, 0]
    },
    "80": {
      base: [
        [-2, 0, 0],   // BottomCase
        [-2, 1.5, 0.2], // PCB
        [-2, 2.3, 0.3], // Plate
        [-2, 3.1, 0.4], // Screw
        [-2, 3.9, 0.5], // TopCase
        [-2, 4.7, 0.6]  // Stabilizers
      ],
      switch: [-2, 3, 0],
      keycap: [-2, 3, 0]
    },
    "100": {
      base: [
        [-2.5, 0, 0],   // BottomCase
        [-2.5, 1.5, 0.2], // PCB
        [-2.5, 2.3, 0.3], // Plate
        [-2.5, 3.1, 0.4], // Screw
        [-2.5, 3.9, 0.5], // TopCase
        [-2.5, 4.7, 0.6]  // Stabilizers
      ],
      switch: [-2.5, 3, 0],
      keycap: [-2.5, 3, 0]
    }
  },
  finalPositions: {
    "60": {
      base: [
        [-1.5, 0, 0],   // BottomCase
        [-1.5, 0, 0],   // PCB
        [-1.5, 0, 0],   // Plate
        [-1.5, 0, 0],   // Screw
        [-1.5, 0, 0],   // TopCase
        [-1.5, 0, 0]    // Stabilizers
      ],
      switch: [-1.5, 0, 0],
      keycap: [-1.5, 0, 0]
    },
    "80": {
      base: [
        [-2, 0, 0],   // BottomCase
        [-2, 0, 0],   // PCB
        [-2, 0, 0],   // Plate
        [-2, 0, 0],   // Screw
        [-2, 0, 0],   // TopCase
        [-2, 0, 0]    // Stabilizers
      ],
      switch: [-2, 0, 0],
      keycap: [-2, 0, 0]
    },
    "100": {
      base: [
        [-2.5, 0, 0],   // BottomCase
        [-2.5, 0, 0],   // PCB
        [-2.5, 0, 0],   // Plate
        [-2.5, 0, 0],   // Screw
        [-2.5, 0, 0],   // TopCase
        [-2.5, 0, 0]    // Stabilizers
      ],
      switch: [-2.5, 0, 0],
      keycap: [-2.5, 0, 0]
    }
  },
  
  getScale: (size) => {
    return KEYBOARD_POSITIONS.scales[size] || 25;
  },
  
  getInitialPosition: (size, partType, index = null) => {
    if (index !== null && partType === 'base') {
      return KEYBOARD_POSITIONS.initialPositions[size].base[index];
    }
    return KEYBOARD_POSITIONS.initialPositions[size][partType];
  },
  
  getFinalPosition: (size, partType, index = null) => {
    if (index !== null && partType === 'base') {
      return KEYBOARD_POSITIONS.finalPositions[size].base[index];
    }
    return KEYBOARD_POSITIONS.finalPositions[size][partType];
  }
};