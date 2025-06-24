import Joi from "joi";

export const dashboardValidator = {
  create: Joi.object({
    sectionID: Joi.valid("HERO_BANNER", "TENTANG_KAMI", "VISI", "MISI", "KEPERCAYAAN_PRESTASI", "PROGRAM_PELATIHAN", "TIM", "KARYA_SISWA", "TESTIMONI", "INDUSTRI", "FAQ", "FOOTER").required(),
    sectionName: Joi.string().required(),
    isTitle: Joi.boolean().default(false),
    title: Joi.string().optional().allow(null),
    description: Joi.string().optional().allow(null),
    add_string_1: Joi.string().optional().allow(null),
    siswa_counter: Joi.string().optional().allow(null),
    industri_counter: Joi.string().optional().allow(null),
    alumni_counter: Joi.string().optional().allow(null),
    training_id: Joi.number().integer().optional().allow(null)
  }),
  update: Joi.object({
    sectionID: Joi.valid("HERO_BANNER", "TENTANG_KAMI", "VISI", "MISI", "KEPERCAYAAN_PRESTASI", "PROGRAM_PELATIHAN", "TIM", "KARYA_SISWA", "TESTIMONI", "INDUSTRI", "FAQ", "FOOTER").required(),
    sectionName: Joi.string().required(),
    isTitle: Joi.boolean().default(false),
    title: Joi.string().optional().allow(null),
    description: Joi.string().optional().allow(null),
    add_string_1: Joi.string().optional().allow(null),
    siswa_counter: Joi.string().optional().allow(null),
    industri_counter: Joi.string().optional().allow(null),
    alumni_counter: Joi.string().optional().allow(null),
    training_id: Joi.number().integer().optional().allow(null)
  }),
};

export default dashboardValidator;
