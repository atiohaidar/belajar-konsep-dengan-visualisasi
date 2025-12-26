// Animation variants dan utilities untuk Framer Motion
// Gunakan variants ini untuk konsistensi animasi di seluruh project

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
};

export const slideInFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export const slideInFromRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export const slideInFromTop = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export const slideInFromBottom = {
    hidden: { y: 100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export const scaleUp = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    }
};

export const scaleDown = {
    hidden: { scale: 1.5, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    }
};

export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const pulseFast = {
    animate: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const float = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const bounce = {
    animate: {
        y: [0, -20, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeOut",
            times: [0, 0.5, 1]
        }
    }
};

export const shake = {
    animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
            repeat: 0
        }
    }
};

export const spin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    }
};

export const wave = {
    animate: {
        rotate: [0, 14, -8, 14, -4, 10, 0],
        transition: {
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1
        }
    }
};

// Animasi untuk data packet yang bergerak
export const packetMove = (fromX: number, toX: number, fromY: number = 0, toY: number = 0) => ({
    hidden: { x: fromX, y: fromY, opacity: 0, scale: 0.5 },
    visible: {
        x: toX,
        y: toY,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1,
            type: "spring",
            stiffness: 50,
            damping: 10
        }
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.3 }
    }
});

// Animasi packet dengan trail effect
export const packetWithTrail = (fromX: number, toX: number) => ({
    hidden: { x: fromX, opacity: 0 },
    visible: {
        x: toX,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1] // Custom bezier for smooth feel
        }
    }
});

// Stagger children animation
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

export const staggerContainerFast = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
};

// Glow effect untuk komponen aktif
export const glowPulse = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.3)",
            "0 0 40px rgba(59, 130, 246, 0.6)",
            "0 0 20px rgba(59, 130, 246, 0.3)"
        ],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    }
};

// Glow variants untuk berbagai warna
export const glowPurple = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(168, 85, 247, 0.3)",
            "0 0 40px rgba(168, 85, 247, 0.6)",
            "0 0 20px rgba(168, 85, 247, 0.3)"
        ],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    }
};

export const glowGreen = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 40px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)"
        ],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    }
};

// Elastic pop-in
export const elasticPop = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

// Ripple effect untuk clicks
export const ripple = {
    hidden: { scale: 0, opacity: 1 },
    visible: {
        scale: 4,
        opacity: 0,
        transition: { duration: 0.6 }
    }
};

// Expand from center
export const expandFromCenter = {
    hidden: { scaleX: 0 },
    visible: {
        scaleX: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

// Success checkmark animation
export const successCheck = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.2 }
        }
    }
};

// Confetti-like burst
export const confettiBurst = (angle: number) => ({
    hidden: { x: 0, y: 0, opacity: 1, scale: 0 },
    visible: {
        x: Math.cos(angle) * 100,
        y: Math.sin(angle) * 100 - 50, // offset for gravity
        opacity: 0,
        scale: 1,
        transition: {
            duration: 1,
            ease: "easeOut"
        }
    }
});

