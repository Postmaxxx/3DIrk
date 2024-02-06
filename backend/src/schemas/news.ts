
/**
 * @openapi
 * components:
 *   schemas:
 *     NewsItemLoad:
 *       type: object
 *       required:
 *         - _id
 *         - date
 *         - header
 *         - short
 *         - text
 *         - images
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto generated id of the news
 *         header: 
 *           $ref: '#/components/schemas/TLang'
 *         short: 
 *           $ref: '#/components/schemas/TLang'
 *         text: 
 *           $ref: '#/components/schemas/TLang'
 *         images:
 *           $ref: '#/components/schemas/Images'
 *       example:
 *         _id: 654945e437faacebb608292e
 *         header: {en: 'News title', ru: 'Заголовок новости'}
 *         date: 2023-03-22T00:00:00.000Z
 *         short: {en: 'News short text', ru: 'Короткий текст новости'}
 *         text: {en: 'News full text', ru: 'Полный текст новости'}
 *         images: {basePath: 234234234, files: [..., ...], sizes: [big, huge, preview]}
 *                  
 * 
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     NewsItemNew:
 *       type: object
 *       required:
 *         - date
 *         - header
 *         - short
 *         - text
 *         - files
 *       properties:
 *         header: 
 *           $ref: '#/components/schemas/TLang'
 *         short: 
 *           $ref: '#/components/schemas/TLang'
 *         text: 
 *           $ref: '#/components/schemas/TLang'
 *         files:
 *           type: array
 *           items: 
 *             type: string
 *       example:
 *         header: {en: 'News title', ru: 'Заголовок новости'}
 *         date: 2023-03-22T00:00:00.000Z
 *         short: {en: 'News short text lorem lorem lorem lorem lorem ', ru: 'Короткий текст новости lorem lorem lorem lorem lorem '}
 *         text: {en: 'News full text lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem ', ru: 'Полный текст новости lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '}
 *         files: [..., ..., ...]
 *                  
 * 
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     NewsItemUpdate:
 *       type: object
 *       required:
 *         - id
 *         - date
 *         - header
 *         - short
 *         - text
 *         - files
 *       properties:
 *         _id:
 *           type: string
 *           description: The id of the news
 *         header: 
 *           $ref: '#/components/schemas/TLang'
 *         short: 
 *           $ref: '#/components/schemas/TLang'
 *         text: 
 *           $ref: '#/components/schemas/TLang'
 *         files:
 *           type: array
 *           items: 
 *             type: string
 *       example:
 *         _id: 654945e437faacebb608292e
 *         header: {en: 'News title', ru: 'Заголовок новости'}
 *         date: 2023-03-22T00:00:00.000Z
 *         short: {en: 'News short text', ru: 'Короткий текст новости'}
 *         text: {en: 'News full text', ru: 'Полный текст новости'}
 *         files: [..., ..., ...]
 *                  
 * 
 */