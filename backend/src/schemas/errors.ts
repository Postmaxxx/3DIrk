/**
 * @openapi
 * components:
 *   schemas:
 *     UnauthorizedError:
 *       type: object
 *       description: Error message
 *       properties: 
 *         message: 
 *           type: object
 *           $ref: '#/components/schemas/TLang'
 *         errors: 
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TLang'
 * 
 */