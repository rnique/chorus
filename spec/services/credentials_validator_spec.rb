require 'spec_helper'

describe CredentialsValidator do
  describe ".user" do
    around do |example|
      original = I18n.load_path
      I18n.load_path = ['config/locales/en.yml']

      example.run

      I18n.load_path = original
    end

    it "returns the user" do
      user = stub
      stub(User).authenticate('a_username', 'a_password') { user }
      CredentialsValidator.user('a_username', 'a_password').should be(user)
    end

    it "raises an exception if the username is missing" do
      begin
        CredentialsValidator.user(nil, 'a_password')
        fail
      rescue CredentialsValidator::Invalid => e
        e.record.errors.get(:username).should == ["REQUIRED"]
      end
    end

    it "raises an exception if the password is missing" do
      begin
        CredentialsValidator.user('a_username', nil)
        fail
      rescue CredentialsValidator::Invalid => e
        e.record.errors.get(:password).should == ["REQUIRED"]
      end
    end

    it "raises an exception if the user cannot be authenticated" do
      begin
        stub(User).authenticate('a_username', 'a_password') { nil }
        CredentialsValidator.user('a_username', 'a_password')
        fail
      rescue CredentialsValidator::Invalid => e
        e.record.errors.get(:username_or_password).should == ["INVALID"]
      end
    end

    context "when the LDAP switch is configured" do
      it "uses the LdapClient authentication" do
        Chorus::Application.config.ldap_authentication = true

        user = stub
        stub(LdapClient).authenticate('a_username', 'a_password') { user }
        CredentialsValidator.user('a_username', 'a_password').should be(user)
      end
    end
  end
end
