// Device safe area insets configuration with physical appearance
import type { DevicesCollection } from '../types/global.js';

const DEVICES: DevicesCollection = {
  none: {
    name: "None (Default)",
    safeAreaInsets: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      borderRadius: 0,
      screenRadius: 0,
      notch: {
        type: "none"
      },
      homeIndicator: null,
      colors: [],
      brand: "custom",
      show: false
    }
  },
  iphone14: {
    name: "iPhone 14",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 146.7,
      height: 284,
      screenWidth: 130,
      screenHeight: 260,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 30,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#1f1f1f", "#2d2d2d", "#3a3a3a"], // Space Black gradient
      brand: "apple"
    }
  },
  iphone14Pro: {
    name: "iPhone 14 Pro",
    safeAreaInsets: {
      top: 59,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 147.5,
      height: 285,
      screenWidth: 131,
      screenHeight: 261,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 32,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#2c2c2e", "#3a3a3c", "#48484a"], // Deep Purple
      brand: "apple",
      frameImage: {
        light: "iphone14-pro-light.png",
        dark: "iphone14-pro-dark.png",
        hasDynamicIsland: true,
        hasHomeIndicator: true,
        screenOffset: { x: 8.25, y: 12, width: 131, height: 261 }
      }
    }
  },
  iphone14ProMax: {
    name: "iPhone 14 Pro Max",
    safeAreaInsets: {
      top: 59,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 160.7,
      height: 310,
      screenWidth: 144,
      screenHeight: 286,
      borderRadius: 22,
      screenRadius: 18,
      notch: {
        type: "dynamic-island",
        width: 34,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 40,
        height: 2,
        radius: 1
      },
      colors: ["#2c2c2e", "#3a3a3c", "#48484a"],
      brand: "apple"
    }
  },
  iphoneX: {
    name: "iPhone X/XS",
    safeAreaInsets: {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 143.6,
      height: 280,
      screenWidth: 127,
      screenHeight: 256,
      borderRadius: 18,
      screenRadius: 14,
      notch: {
        type: "notch",
        width: 40,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#1f1f1f", "#2d2d2d", "#3a3a3a"],
      brand: "apple"
    }
  },
  iphoneXR: {
    name: "iPhone XR/11",
    safeAreaInsets: {
      top: 48,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 150.9,
      height: 290,
      screenWidth: 134,
      screenHeight: 266,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "notch",
        width: 42,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 38,
        height: 2,
        radius: 1
      },
      colors: ["#ff6b6b", "#ff8e8e", "#ffb3b3"], // Product RED
      brand: "apple"
    }
  },
  iphone12: {
    name: "iPhone 12/12 Pro",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 146.7,
      height: 284,
      screenWidth: 130,
      screenHeight: 260,
      borderRadius: 19,
      screenRadius: 15,
      notch: {
        type: "notch",
        width: 38,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#4a90e2", "#5ba0f2", "#6cb0ff"], // Pacific Blue
      brand: "apple"
    }
  },
  iphone12Mini: {
    name: "iPhone 12 Mini",
    safeAreaInsets: {
      top: 50,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 131.5,
      height: 255,
      screenWidth: 115,
      screenHeight: 231,
      borderRadius: 17,
      screenRadius: 13,
      notch: {
        type: "notch",
        width: 34,
        height: 7,
        radius: 3
      },
      homeIndicator: {
        width: 32,
        height: 2,
        radius: 1
      },
      colors: ["#50e3c2", "#70f3d2", "#90ffe2"], // Green
      brand: "apple"
    }
  },
  iphone12ProMax: {
    name: "iPhone 12 Pro Max",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 160.8,
      height: 310,
      screenWidth: 144,
      screenHeight: 286,
      borderRadius: 22,
      screenRadius: 18,
      notch: {
        type: "notch",
        width: 42,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 40,
        height: 2,
        radius: 1
      },
      colors: ["#c9b037", "#d4c547", "#dfda57"], // Gold
      brand: "apple"
    }
  },
  iphone13: {
    name: "iPhone 13",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 146.7,
      height: 284,
      screenWidth: 130,
      screenHeight: 260,
      borderRadius: 19,
      screenRadius: 15,
      notch: {
        type: "small-notch",
        width: 32,
        height: 6,
        radius: 3
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#ffc0cb", "#ffd0db", "#ffe0eb"], // Pink
      brand: "apple"
    }
  },
  iphone13Mini: {
    name: "iPhone 13 Mini",
    safeAreaInsets: {
      top: 50,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 131.5,
      height: 255,
      screenWidth: 115,
      screenHeight: 231,
      borderRadius: 17,
      screenRadius: 13,
      notch: {
        type: "small-notch",
        width: 28,
        height: 6,
        radius: 3
      },
      homeIndicator: {
        width: 32,
        height: 2,
        radius: 1
      },
      colors: ["#4169e1", "#5179f1", "#6189ff"], // Blue
      brand: "apple"
    }
  },
  iphone13Pro: {
    name: "iPhone 13 Pro",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 147.5,
      height: 285,
      screenWidth: 131,
      screenHeight: 261,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "small-notch",
        width: 32,
        height: 6,
        radius: 3
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#2c2c2e", "#3a3a3c", "#48484a"], // Graphite
      brand: "apple"
    }
  },
  iphone13ProMax: {
    name: "iPhone 13 Pro Max",
    safeAreaInsets: {
      top: 47,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 160.8,
      height: 310,
      screenWidth: 144,
      screenHeight: 286,
      borderRadius: 22,
      screenRadius: 18,
      notch: {
        type: "small-notch",
        width: 34,
        height: 6,
        radius: 3
      },
      homeIndicator: {
        width: 40,
        height: 2,
        radius: 1
      },
      colors: ["#a7c0cd", "#b7d0dd", "#c7e0ed"], // Sierra Blue
      brand: "apple"
    }
  },
  iphone15: {
    name: "iPhone 15",
    safeAreaInsets: {
      top: 59,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 147.6,
      height: 285,
      screenWidth: 131,
      screenHeight: 261,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 30,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#ffb3d9", "#ffc3e3", "#ffd3ed"], // Pink
      brand: "apple"
    }
  },
  iphone15Pro: {
    name: "iPhone 15 Pro",
    safeAreaInsets: {
      top: 59,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 146.6,
      height: 284,
      screenWidth: 130,
      screenHeight: 260,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 32,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 36,
        height: 2,
        radius: 1
      },
      colors: ["#d4af37", "#e4bf47", "#f4cf57"], // Natural Titanium
      brand: "apple"
    }
  },
  iphone15ProMax: {
    name: "iPhone 15 Pro Max",
    safeAreaInsets: {
      top: 59,
      bottom: 34,
      left: 0,
      right: 0
    },
    appearance: {
      width: 159.9,
      height: 309,
      screenWidth: 143,
      screenHeight: 285,
      borderRadius: 22,
      screenRadius: 18,
      notch: {
        type: "dynamic-island",
        width: 34,
        height: 8,
        radius: 4
      },
      homeIndicator: {
        width: 40,
        height: 2,
        radius: 1
      },
      colors: ["#708090", "#8090a0", "#90a0b0"], // Blue Titanium
      brand: "apple",
      frameImage: {
        light: "iphone15-promax-light.png",
        dark: "iphone15-promax-dark.png",
        hasDynamicIsland: true,
        hasHomeIndicator: true,
        screenOffset: { x: 8.5, y: 12, width: 143, height: 285 }
      }
    }
  },
  // Android devices with realistic appearance
  pixelXL: {
    name: "Google Pixel XL",
    safeAreaInsets: {
      top: 24,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 154.7,
      height: 295,
      screenWidth: 138,
      screenHeight: 271,
      borderRadius: 8,
      screenRadius: 4,
      notch: {
        type: "none"
      },
      homeIndicator: null,
      colors: ["#34495e", "#4a6275", "#607a8c"], // Quite Black
      brand: "google"
    }
  },
  pixel3XL: {
    name: "Google Pixel 3 XL",
    safeAreaInsets: {
      top: 28,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 158,
      height: 300,
      screenWidth: 142,
      screenHeight: 276,
      borderRadius: 12,
      screenRadius: 8,
      notch: {
        type: "notch",
        width: 36,
        height: 6,
        radius: 3
      },
      homeIndicator: null,
      colors: ["#1a1a1a", "#2a2a2a", "#3a3a3a"], // Just Black
      brand: "google"
    }
  },
  pixel4: {
    name: "Google Pixel 4",
    safeAreaInsets: {
      top: 28,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 147.1,
      height: 280,
      screenWidth: 131,
      screenHeight: 256,
      borderRadius: 10,
      screenRadius: 6,
      notch: {
        type: "forehead",
        width: 131,
        height: 6,
        radius: 0
      },
      homeIndicator: null,
      colors: ["#ffffff", "#f5f5f5", "#ebebeb"], // Clearly White
      brand: "google"
    }
  },
  samsungS21: {
    name: "Samsung Galaxy S21",
    safeAreaInsets: {
      top: 28,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 151.7,
      height: 290,
      screenWidth: 135,
      screenHeight: 266,
      borderRadius: 16,
      screenRadius: 12,
      notch: {
        type: "punch-hole",
        width: 8,
        height: 8,
        radius: 4,
        position: "center-top"
      },
      homeIndicator: null,
      colors: ["#9b59b6", "#ae6fc6", "#c185d6"], // Phantom Violet
      brand: "samsung"
    }
  },
  samsungS22: {
    name: "Samsung Galaxy S22",
    safeAreaInsets: {
      top: 32,
      bottom: 0,
      left: 0,
      right: 0
    },
    appearance: {
      width: 146,
      height: 285,
      screenWidth: 130,
      screenHeight: 261,
      borderRadius: 16,
      screenRadius: 12,
      notch: {
        type: "punch-hole",
        width: 8,
        height: 8,
        radius: 4,
        position: "center-top"
      },
      homeIndicator: null,
      colors: ["#2ecc71", "#4ed681", "#6ee091"], // Phantom Green
      brand: "samsung",
      frameImage: {
        light: "samsung-s22-light.png",
        dark: "samsung-s22-dark.png",
        hasDynamicIsland: false,
        hasHomeIndicator: false,
        screenOffset: { x: 8, y: 12, width: 130, height: 261 }
      }
    }
  },
  // Landscape orientation variations
  iphone14Landscape: {
    name: "iPhone 14 (Landscape)",
    safeAreaInsets: {
      top: 0,
      bottom: 21,
      left: 47,
      right: 47
    },
    appearance: {
      width: 284,
      height: 146.7,
      screenWidth: 260,
      screenHeight: 130,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 8,
        height: 30,
        radius: 4,
        position: "left"
      },
      homeIndicator: {
        width: 2,
        height: 36,
        radius: 1,
        position: "bottom"
      },
      colors: ["#1f1f1f", "#2d2d2d", "#3a3a3a"],
      brand: "apple",
      orientation: "landscape"
    }
  },
  iphone14ProLandscape: {
    name: "iPhone 14 Pro (Landscape)",
    safeAreaInsets: {
      top: 0,
      bottom: 21,
      left: 59,
      right: 59
    },
    appearance: {
      width: 285,
      height: 147.5,
      screenWidth: 261,
      screenHeight: 131,
      borderRadius: 20,
      screenRadius: 16,
      notch: {
        type: "dynamic-island",
        width: 8,
        height: 32,
        radius: 4,
        position: "left"
      },
      homeIndicator: {
        width: 2,
        height: 36,
        radius: 1,
        position: "bottom"
      },
      colors: ["#2c2c2e", "#3a3a3c", "#48484a"],
      brand: "apple",
      orientation: "landscape"
    }
  }
};

// Export for use in other files
export default DEVICES; 