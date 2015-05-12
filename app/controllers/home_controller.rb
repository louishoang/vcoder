class HomeController < ApplicationController
  include ApplicationHelper

  before_filter :unset_footer
  def index
  end

  def contact_us
    UserMailer.contact_us(params).deliver
    render :json => {data: "We have received your enquiry and will respond to you within 24 hours."}
  end
end
