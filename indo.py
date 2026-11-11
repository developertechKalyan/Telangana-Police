import matplotlib.pyplot as plt

# Data
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 150, 180, 140, 220, 260]

# Create line graph
plt.plot(months, sales, marker="o")

# Labels and title
plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

# Show grid
plt.grid(True)

# Display graph
plt.show()