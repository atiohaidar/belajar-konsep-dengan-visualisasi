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

export const scaleUp = {
    hidden: { scale: 0, opacity: 0 },
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
