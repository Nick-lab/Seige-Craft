class Rectangle {
    // Public properties
    x!: number;
    y!: number;
    width!: number;
    height!: number;

    /**
     * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
     *
     * Example:
     *      let rect = new Rectangle(0, 0, 100, 100);
     *
     * @param x X position.
     * @param y Y position.
     * @param width The width of the Rectangle.
     * @param height The height of the Rectangle.
     */
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.setValues(x, y, width, height);
    }

    /**
     * Sets the specified values on this instance.
     * @param x X position.
     * @param y Y position.
     * @param width The width of the Rectangle.
     * @param height The height of the Rectangle.
     * @returns This instance. Useful for chaining method calls.
     */
    setValues(x: number = 0, y: number = 0, width: number = 0, height: number = 0): Rectangle {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    /**
     * Extends the rectangle's bounds to include the described point or rectangle.
     * @param x X position of the point or rectangle.
     * @param y Y position of the point or rectangle.
     * @param width The width of the rectangle.
     * @param height The height of the rectangle.
     * @returns This instance. Useful for chaining method calls.
     */
    extend(x: number, y: number, width: number = 0, height: number = 0): Rectangle {
        if (x + width > this.x + this.width) { 
            this.width = x + width - this.x; 
        }
        if (y + height > this.y + this.height) { 
            this.height = y + height - this.y; 
        }
        if (x < this.x) { 
            this.width += this.x - x; 
            this.x = x; 
        }
        if (y < this.y) { 
            this.height += this.y - y; 
            this.y = y; 
        }
        return this;
    }

    /**
     * Adds the specified padding to the rectangle's bounds.
     * @param top Top padding.
     * @param left Left padding.
     * @param right Right padding.
     * @param bottom Bottom padding.
     * @returns This instance. Useful for chaining method calls.
     */
    pad(top: number, left: number, bottom: number, right: number): Rectangle {
        this.x -= left;
        this.y -= top;
        this.width += left + right;
        this.height += top + bottom;
        return this;
    }

    /**
     * Copies all properties from the specified rectangle to this rectangle.
     * @param rectangle The rectangle to copy properties from.
     * @returns This rectangle. Useful for chaining method calls.
     */
    copy(rectangle: Rectangle): Rectangle {
        return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }

    /**
     * Returns true if this rectangle fully encloses the described point or rectangle.
     * @param x X position of the point or rectangle.
     * @param y Y position of the point or rectangle.
     * @param width The width of the rectangle.
     * @param height The height of the rectangle.
     * @returns True if the described point or rectangle is contained within this rectangle.
     */
    contains(x: number, y: number, width: number = 0, height: number = 0): boolean {
        return (x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height);
    }

    /**
     * Returns a new rectangle which contains this rectangle and the specified rectangle.
     * @param rect The rectangle to calculate a union with.
     * @returns A new rectangle describing the union.
     */
    union(rect: Rectangle): Rectangle {
        return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
     * or null if they do not intersect.
     * @param rect The rectangle to calculate an intersection with.
     * @returns A new rectangle describing the intersection or null.
     */
    intersection(rect: Rectangle): Rectangle | null {
        let x1 = rect.x;
        let y1 = rect.y;
        let x2 = x1 + rect.width;
        let y2 = y1 + rect.height;

        if (this.x > x1) x1 = this.x;
        if (this.y > y1) y1 = this.y;
        if (this.x + this.width < x2) x2 = this.x + this.width;
        if (this.y + this.height < y2) y2 = this.y + this.height;

        if (x2 <= x1 || y2 <= y1) {
            return null;
        }

        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
     * @param rect The rectangle to compare.
     * @returns True if the rectangles intersect.
     */
    intersects(rect: Rectangle): boolean {
        return (rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height);
    }

    /**
     * Returns true if the width or height are equal or less than 0.
     * @returns True if the rectangle is empty.
     */
    isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Returns a clone of the Rectangle instance.
     * @returns a clone of the Rectangle instance.
     */
    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Returns a string representation of this object.
     * @returns a string representation of the instance.
     */
    toString(): string {
        return `[Rectangle (x=${this.x} y=${this.y} width=${this.width} height=${this.height})]`;
    }
}

export default Rectangle;