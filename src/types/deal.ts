export interface Deal {
  id: number;
  tool_id?: number;
  offer_title: string;
  tool_name: string;
  tool_short_desc: string;
  image_url: string;
  old_price?: number;
  new_price?: number;
  discount_percentage?: number;
  expiry_date: string;
  claims_count: number;
  offer_tag: string;
  featured_deal: boolean;
  deal_url: string;
  is_active: boolean;
  created_at: string;
}