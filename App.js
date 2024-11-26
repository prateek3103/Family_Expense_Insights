import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, FlatList } from "react-native";
import axios from "axios";

export default function App() {
  const [familyData, setFamilyData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    memberId: "",
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    const response = await axios.post("http://<YOUR_SERVER_URL>/api/contribution", {
      familyId: "1234",
    });
    setFamilyData(response.data);
  };

  const addTransaction = async () => {
    await axios.post("http://<YOUR_SERVER_URL>/api/transaction", {
      ...newTransaction,
      familyId: "1234",
    });
    fetchFamilyData();
    setNewTransaction({ memberId: "", category: "", amount: "", date: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Family Expense Dashboard</Text>
      <Text>Total Expenses: {familyData.totalExpenses}</Text>
      <FlatList
        data={familyData.contributions}
        keyExtractor={(item) => item.memberId}
        renderItem={({ item }) => (
          <Text>
            {item.memberId}: {item.contribution}%
          </Text>
        )}
      />
      <Text>Highest Spender: {familyData.highestSpender}</Text>

      <Text style={styles.header}>Add Transaction</Text>
      <TextInput
        placeholder="Member ID"
        value={newTransaction.memberId}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, memberId: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={newTransaction.category}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, category: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={newTransaction.amount}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={newTransaction.date}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
        style={styles.input}
      />
      <Button title="Add Transaction" onPress={addTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});
