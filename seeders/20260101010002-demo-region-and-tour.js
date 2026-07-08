'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('tours', [
      {
        title: '7天5晚 广州精华游 Guangzhou Highlights (广州塔与长隆之旅)',
        price: 1999.0,
        departure_dates: '2026年9月2, 23日｜12月2日 (02, 23 SEP｜02 DEC 2026)',
        whatsapp_1: '60165563838',
        whatsapp_2: '60167237377',
        pdf_url: null,
        pdf_public_id: null,
        cover_image_url: 'https://picsum.photos/seed/hyt-can08/600/400',
        cover_image_public_id: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tours', { title: '7天5晚 广州精华游 Guangzhou Highlights (广州塔与长隆之旅)' });
  },
};
