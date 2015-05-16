class HomeController < ApplicationController
  include ApplicationHelper

  def index
    unset_footer
  end

  def contact_us
    UserMailer.contact_us(params).deliver
    render :json => {data: "We have received your enquiry and will respond to you within 24 hours."}
  end

  def privacy_policy
  end

  def faq
  end
end
