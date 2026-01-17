/**
 * GSAP Animation Presets for Slot Games
 * Provides reusable animation configurations for cascade, burst, gravity, and spawn animations
 */

import { gsap } from 'gsap';

export interface GSAPPresetConfig {
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  y?: string | number;
  x?: number | string;
  rotation?: number;
  clearProps?: string;
  yoyo?: boolean;
  repeat?: number;
}

export interface GSAPPresetFromTo {
  from: GSAPPresetConfig;
  to: GSAPPresetConfig;
}

export interface GSAPAnimationPresets {
  burst: {
    cell: GSAPPresetConfig;
    image: GSAPPresetConfig;
  };
  gravity: {
    cell: GSAPPresetFromTo;
    image: GSAPPresetFromTo;
  };
  spawn: {
    cell: GSAPPresetFromTo;
    image: GSAPPresetFromTo;
  };
  winningGlow: {
    cell: GSAPPresetConfig;
    image: GSAPPresetConfig;
  };
  reset: {
    all: GSAPPresetConfig;
  };
}

/**
 * GSAP Animation Presets
 * Configurable animation settings for slot game animations
 */
export const GSAPAnimationPresets: GSAPAnimationPresets = {
  // ============================================
  // BURST ANIMATION (Symbol Removal)
  // ============================================
  burst: {
    cell: {
      scale: 0,
      duration: 0.2,
      ease: 'power1.out'
    },
    image: {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.out'
    }
  },

  // ============================================
  // GRAVITY ANIMATION (Existing Symbols Falling)
  // ============================================
  gravity: {
    cell: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        duration: 0.25,
        ease: 'bounce.out',
        clearProps: 'transform'
      }
    },
    image: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        duration: 0.25,
        ease: 'bounce.out',
        clearProps: 'transform'
      }
    }
  },

  // ============================================
  // SPAWN ANIMATION (New Symbols Entering)
  // ============================================
  spawn: {
    cell: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        duration: 0.25,
        ease: 'power2.in',
        clearProps: 'transform'
      }
    },
    image: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        duration: 0.25,
        ease: 'power2.in',
        clearProps: 'transform'
      }
    }
  },

  // ============================================
  // WINNING GLOW ANIMATION
  // ============================================
  winningGlow: {
    cell: {
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    },
    image: {
      scale: 1.25,
      duration: 0.6,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    }
  },

  // ============================================
  // RESET PRESET (Before Any Animation)
  // ============================================
  reset: {
    all: {
      rotation: 0,
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1
    }
  }
};

/**
 * GSAP Animation Helper Functions
 * Utility functions for applying animations using the presets
 */
export const GSAPAnimationHelpers = {
  /**
   * Apply burst animation to elements
   * @param cellTargets - Cell div elements
   * @param imageTargets - Image elements
   * @param onComplete - Callback when animation completes
   * @returns GSAP timeline
   */
  applyBurst(
    cellTargets: HTMLElement[],
    imageTargets: HTMLElement[],
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ onComplete });
    
    timeline.to(cellTargets, GSAPAnimationPresets.burst.cell, 0);
    timeline.to(imageTargets, GSAPAnimationPresets.burst.image, 0);
    
    return timeline;
  },

  /**
   * Apply gravity animation to elements
   * @param cellElement - Cell div element (optional)
   * @param imageElement - Image element
   * @param fallDistance - Distance to fall (percentage)
   * @param durationMultiplier - Optional duration multiplier (default: 1)
   * @returns Array of GSAP animations
   */
  applyGravity(
    imageElement: HTMLElement,
    fallDistance: number,
    cellElement?: HTMLElement | null,
    durationMultiplier: number = 1
  ): gsap.core.Tween[] {
    const anims: gsap.core.Tween[] = [];
    const duration = (GSAPAnimationPresets.gravity.image.to.duration || 0.25) * durationMultiplier;
    
    if (cellElement) {
      anims.push(gsap.fromTo(cellElement, 
        { 
          y: `${fallDistance}%`, 
          x: 0, 
          rotation: 0 
        },
        { 
          ...GSAPAnimationPresets.gravity.cell.to,
          duration
        }
      ));
    }
    
    anims.push(gsap.fromTo(imageElement,
      { 
        y: `${fallDistance}%`, 
        x: 0, 
        rotation: 0 
      },
      { 
        ...GSAPAnimationPresets.gravity.image.to,
        duration
      }
    ));
    
    return anims;
  },

  /**
   * Apply spawn animation to elements
   * @param imageElement - Image element
   * @param fallDistance - Distance to fall (percentage, negative for above grid)
   * @param cellElement - Cell div element (optional)
   * @param durationMultiplier - Optional duration multiplier (default: 1)
   * @returns Array of GSAP animations
   */
  applySpawn(
    imageElement: HTMLElement,
    fallDistance: number,
    cellElement?: HTMLElement | null,
    durationMultiplier: number = 1
  ): gsap.core.Tween[] {
    const anims: gsap.core.Tween[] = [];
    const duration = (GSAPAnimationPresets.spawn.image.to.duration || 0.25) * durationMultiplier;
    
    if (cellElement) {
      anims.push(gsap.fromTo(cellElement,
        { 
          y: `${fallDistance}%`, 
          x: 0, 
          rotation: 0 
        },
        { 
          ...GSAPAnimationPresets.spawn.cell.to,
          duration
        }
      ));
    }
    
    anims.push(gsap.fromTo(imageElement,
      { 
        y: `${fallDistance}%`, 
        x: 0, 
        rotation: 0 
      },
      { 
        ...GSAPAnimationPresets.spawn.image.to,
        duration
      }
    ));
    
    return anims;
  },

  /**
   * Apply winning glow animation
   * @param cellElement - Cell div element
   * @param imageElement - Image element
   * @returns Object with cell and image animations
   */
  applyWinningGlow(
    cellElement: HTMLElement,
    imageElement: HTMLElement
  ): { cell: gsap.core.Tween; image: gsap.core.Tween } {
    return {
      cell: gsap.to(cellElement, GSAPAnimationPresets.winningGlow.cell),
      image: gsap.to(imageElement, GSAPAnimationPresets.winningGlow.image)
    };
  },

  /**
   * Reset transforms on elements
   * @param elements - Element(s) to reset
   */
  reset(elements: HTMLElement | HTMLElement[]): void {
    gsap.set(elements, GSAPAnimationPresets.reset.all);
  }
};

export default GSAPAnimationPresets;
