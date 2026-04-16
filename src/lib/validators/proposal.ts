import { z } from 'zod/v4'

export const generateProposalSchema = z.object({
  description: z
    .string()
    .min(20, 'Please describe the service in at least 20 characters')
    .max(5000, 'Description too long'),
  client_name: z.string().max(200).optional(),
  client_company: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  template: z.string().max(100).optional(),
  currency: z.string().max(3).optional(),
  language: z.string().max(50).optional(),
})

export const updateProposalSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  status: z.enum(['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired']).optional(),
  content: z
    .object({
      summary: z.string(),
      sections: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(
            z.object({
              id: z.string(),
              description: z.string(),
              quantity: z.number().min(0),
              unit_price: z.number().min(0),
              total: z.number().min(0),
            }),
          ),
        }),
      ),
      terms: z.string(),
      payment_terms: z.string(),
    })
    .optional(),
  total_amount: z.number().min(0).optional(),
  valid_until: z.string().optional(),
  client_id: z.string().uuid().optional(),
})

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email'),
  company: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
})

export type GenerateProposalFormData = z.infer<typeof generateProposalSchema>
export type UpdateProposalFormData = z.infer<typeof updateProposalSchema>
export type CreateClientFormData = z.infer<typeof createClientSchema>
