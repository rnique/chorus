require 'spec_helper'

describe Workspaces::CsvImportsController, :greenplum_integration => true, :type => :controller do
  let(:user) { users(:owner) }
  let(:to_table) { "some_new_table" }
  let(:csv_file) { FactoryGirl.create(:csv_file, :workspace => workspace, :user => user) }
  let(:workspace) { workspaces(:real) }
  let(:column_names) { %w(a b c) }
  let(:types) { %w(integer integer integer) }
  let(:delimiter) { ',' }
  let(:has_header) { true }

  let(:file_params) do
    {
        column_names: column_names,
        types: types,
        delimiter: delimiter,
        has_header: has_header.to_s
    }
  end

  let(:params) do
    {
        workspace_id: workspace.to_param,
        csv_id: csv_file.to_param,
        csv_import: csv_import
    }
  end

  let(:csv_import) do
    file_params.merge(import_params)
  end

  let(:import) { CsvImport.last }

  before do
    log_in user

    expect {
      post :create, params
      response.code.should == "201"
    }.to change(CsvImport, :count).by(1)
  end

  context "when importing into a new table" do
    let(:import_params) do
      {
          to_table: to_table,
          truncate: "false",
          new_table: 'true'
      }
    end

    it "creates a CsvImport with the expected values" do
      import.workspace.should == workspace
      import.to_table.should == to_table
      import.csv_file.should == csv_file
      import.truncate.should == false
      import.user_id.should == user.id
      import.new_table.should == true
    end

    it "should update the csv file" do
      csv_file.reload.types.should == types
      csv_file.column_names.should == column_names
      csv_file.delimiter.should == delimiter
      csv_file.has_header.should == has_header
    end
  end

  context "when importing into an existing table" do
    let(:to_table) { "base_table1" }
    let(:import_params) do
      {
          to_table: to_table,
          truncate: "true",
          new_table: 'false'
      }
    end

    it "creates a CsvImport with the expected values" do
      import.workspace.should == workspace
      import.to_table.should == to_table
      import.csv_file.should == csv_file
      import.truncate.should == true
      import.user_id.should == user.id
      import.new_table.should == false
    end
  end
end