/**
 * @openapi
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       properties:
 *         subFolder:
 *           type: string
 *           enum: [thumb, preview, extraSmall, small, medium, large, extraLarge, huge, full, carouselMaxFull, carouselMaxMedium,  carouselMaxSmall]
 *           description: The subfolder for the image
 *           minLength: 3
 *           maxLength: 50
 *         h: 
 *           type: integer
 *           minimum: 1
 *           maximum: 2000
 *           description: The height of the image
 *         w: 
 *           type: integer
 *           minimum: 1
 *           maximum: 2000
 *           description: The width of the image
 *       example:
 *         subFolder: thumb
 *         h: 50
 *         w: 100               
 * 
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Images:
 *       type: object
 *       properties:
 *         basePath:
 *           type: string
 *           description: The base path for images, as a root folder
 *         files: 
 *           type: array
 *           items: 
 *             type: string 
 *           description: The image content
 *         sizes: 
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *       example:
 *         basePath: preview
 *         files: [..., ...]
 *         sizes: [preview, thumb, full]
 *                  
 * 
 */