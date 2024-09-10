export class HitCircle {
    constructor(x, y, radius, appearTime) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fadeDuration = 150; // Duration of fade-in effect in milliseconds
        this.appearTime = appearTime; // Time at which the circle appears
        this.hitTime = appearTime + 1000; // Time at which the circle should be hit
        this.despawnTime = this.hitTime + 500; // Time after which the circle despawns
        this.hit = false;  // Whether the circle has been hit
    }

    // Calculate opacity based on fade-in effect
    getOpacity(currentTime) {
        if (currentTime < this.appearTime) {
            return 0; // Fully transparent before the appearTime
        }
        const fadeStartTime = this.appearTime;
        const fadeEndTime = this.appearTime + this.fadeDuration;
        if (currentTime < fadeStartTime) {
            return 0;
        }
        if (currentTime >= fadeEndTime) {
            return 1;
        }
        const fadeProgress = (currentTime - fadeStartTime) / this.fadeDuration;
        return Math.min(fadeProgress, 1); // Ensure opacity is between 0 and 1
    }

    // Calculate opacity based on appearTime and hitTime
    getOpacityHitTime(currentTime) {
        if (currentTime < this.appearTime) {
            return 0; // Fully transparent before the appearTime
        }
        const fadeStartTime = this.appearTime;
        const fadeEndTime = this.hitTime;
        if (currentTime < fadeStartTime) {
            return 0;
        }
        if (currentTime >= fadeEndTime) {
            return 1;
        }
        const fadeProgress = (currentTime - fadeStartTime) / (fadeEndTime - fadeStartTime);
        return Math.min(fadeProgress, 1);
    }

    // Calculate approach circle size based on time
    getApproachCircleSize(currentTime) {
        const approachStartTime = this.appearTime;
        const approachEndTime = this.hitTime;

        if(currentTime < approachStartTime){
            return 0;
        }

        if (currentTime >= approachEndTime) {
            return this.radius;
        }

        if (currentTime >= approachEndTime) {
            return this.radius * 2;
        }

        const approachProgress = (currentTime - approachStartTime) / (approachEndTime - approachStartTime);

        return this.radius + this.radius * (1 - approachProgress);
    }

    // Check if the circle should be shown
    isVisible(currentTime) {
        return currentTime >= this.appearTime && !this.hit;
    }

    // Draw the hit circle
    draw(ctx, currentTime) {
        if (!this.isVisible(currentTime)) return;

        const opacity = this.getOpacity(currentTime);
        const opactityHitTime = this.getOpacityHitTime(currentTime);

        // Draw the approach circle
        const approachCircleSize = this.getApproachCircleSize(currentTime);
        ctx.beginPath();
        ctx.arc(this.x, this.y, approachCircleSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opactityHitTime})`; // Semi-transparent approach circle
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    // Handle hit detection
    checkHit(x, y, currentTime) {
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.radius && currentTime <= this.despawnTime) {
            this.hit = true;
            return true;
        }

        return false;
    }

    shouldDespawn(currentTime) {
        return currentTime > this.despawnTime;
    }
}