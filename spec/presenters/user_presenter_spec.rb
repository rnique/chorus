require 'spec_helper'

describe UserPresenter do
  before(:each) do
    @user = FactoryGirl.build :user
    @presenter = UserPresenter.new(@user)
  end

  describe "#to_hash" do
    before do
      @hash = @presenter.to_hash
    end

    it "includes the right keys" do
      @hash.should have_key(:username)
      @hash.should have_key(:image_file_name)
      @hash.should have_key(:id)
    end

    it "does not include unwanted keys" do
      @hash.should_not have_key(:password_digest)
    end
  end
end
