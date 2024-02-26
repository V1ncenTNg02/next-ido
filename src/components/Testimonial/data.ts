import { Testimonial } from './model'
import { SBTestimonial } from '../../storyblok/models'

export const mapTestimonial = (data: SBTestimonial): Testimonial => ({
  rating: data.rating,
  comments: data.comments,
  name: data.name,
  role: data.role,
  imgSrc: data.testimonial_image.filename,
  imgAlt: data.testimonial_image.alt,
  logoSrc: data.company_logo.filename,
  logoAlt: data.company_logo.alt,
  reversed: data.reversed
})
